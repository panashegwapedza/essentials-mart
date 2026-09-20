import { principal } from '../apps/customer_web/api/_auth.js';

type Row = Record<string, any>;

function json(res: any, status: number, body: unknown) {
  return res.status(status).setHeader('Content-Type', 'application/json').setHeader('Cache-Control', 'no-store').json(body);
}

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase household configuration is missing.');
  return { url: url.replace(/\/$/, ''), key };
}

async function supabase<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = config();
  const response = await fetch(url + '/rest/v1/' + path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error('Supabase household request failed (' + response.status + '): ' + detail.slice(0, 300));
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

async function customerIdForAuthUser(authUserId: string) {
  const rows = await supabase<Array<{ id: string }>>(
    'customers?auth_user_id=eq.' + encodeURIComponent(authUserId) + '&select=id&limit=1',
  );
  return rows[0]?.id ?? null;
}

async function householdForCustomer(customerId: string) {
  const rows = await supabase<Array<{
    household_id: string;
    role: string;
    status: string;
    households: { status: string; name: string | null };
  }>>(
    'household_memberships?customer_id=eq.' + encodeURIComponent(customerId) +
    '&status=eq.active&select=household_id,role,status,households!inner(status,name)&limit=1',
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.household_id,
    name: row.households.name,
    status: row.households.status,
    role: row.role,
  };
}

export default async function householdHandler(req: any, res: any) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).setHeader('Allow', 'GET, POST').json({ error: { message: 'Method not allowed.' } });
  }

  try {
    const user = await principal(req);
    if (!user) return json(res, 401, { error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } });

    const customerId = await customerIdForAuthUser(user.authUserId);
    if (!customerId) return json(res, 404, { error: { code: 'CUSTOMER_NOT_FOUND', message: 'Authenticated user has no customer identity.' } });

    if (req.method === 'GET') {
      const household = await householdForCustomer(customerId);
      if (!household) return json(res, 200, { household: null });

      const memberships = await supabase<Array<{ customer_id: string }>>(
        'household_memberships?household_id=eq.' + encodeURIComponent(household.id) +
        '&status=eq.active&select=customer_id',
      );
      const memberIds = memberships.map(row => row.customer_id);
      const [preferences, lists, pantry, orders] = await Promise.all([
        supabase<Row[]>('household_preferences?household_id=eq.' + household.id + '&select=*&limit=1'),
        supabase<Row[]>('household_shopping_lists?household_id=eq.' + household.id + '&status=eq.active&select=id,name,status,created_by_customer_id,created_at,updated_at,version&order=created_at.asc'),
        supabase<Row[]>('household_pantry_items?household_id=eq.' + household.id + '&select=id,product_id,product_name,quantity,unit,status,source,last_confirmed_at,updated_at&order=updated_at.desc'),
        memberIds.length
          ? supabase<Row[]>('orders?customer_id=in.(' + memberIds.join(',') + ')&select=id,customer_id,status,currency,total,subtotal,created_at&order=created_at.desc&limit=100')
          : Promise.resolve([]),
      ]);

      const listItems = lists.length
        ? await supabase<Row[]>('household_shopping_list_items?shopping_list_id=in.(' + lists.map(list => list.id).join(',') + ')&select=id,shopping_list_id,product_id,requested_name,quantity,status,source,added_by_customer_id,created_at,updated_at&order=created_at.asc')
        : [];
      const listItemsByList = new Map<string, Row[]>();
      for (const item of listItems) {
        const items = listItemsByList.get(item.shopping_list_id) ?? [];
        items.push(item);
        listItemsByList.set(item.shopping_list_id, items);
      }
      const shoppingListSummary = {
        activeListCount: lists.length,
        openItemCount: listItems.filter(item => item.status === 'open').length,
        basketReadyItemCount: listItems.filter(item => item.status === 'added_to_basket').length,
        recurringItemCount: listItems.filter(item => item.source === 'recurring').length,
        aiSuggestedItemCount: listItems.filter(item => item.source === 'ai' || item.source === 'recommendation').length,
        lists: lists.map(list => ({ ...list, itemCount: (listItemsByList.get(list.id) ?? []).length, items: listItemsByList.get(list.id) ?? [] })),
      };

      const orderIds = orders.map(order => order.id);
      const orderItems = orderIds.length
        ? await supabase<Row[]>('order_items?order_id=in.(' + orderIds.join(',') + ')&select=order_id,product_id,product_name,sku,quantity,unit_price,line_total,created_at&order=created_at.asc')
        : [];

      const itemsByOrder = new Map<string, Row[]>();
      for (const item of orderItems) {
        const items = itemsByOrder.get(item.order_id) ?? [];
        items.push(item);
        itemsByOrder.set(item.order_id, items);
      }

      const purchaseHistory = orders.map(order => ({
        id: order.id,
        customerId: order.customer_id,
        status: order.status,
        currency: order.currency,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        createdAt: order.created_at,
        items: itemsByOrder.get(order.id) ?? [],
      }));

      const productTotals = new Map<string, { productId: string; productName: string; quantity: number; purchases: number; lastPurchasedAt: string }>();
      for (const order of purchaseHistory) {
        for (const item of order.items) {
          const key = item.product_id ?? item.product_name;
          const current = productTotals.get(key);
          if (current) {
            current.quantity += Number(item.quantity);
            current.purchases += 1;
            if (item.created_at > current.lastPurchasedAt) current.lastPurchasedAt = item.created_at;
          } else {
            productTotals.set(key, {
              productId: item.product_id,
              productName: item.product_name,
              quantity: Number(item.quantity),
              purchases: 1,
              lastPurchasedAt: item.created_at,
            });
          }
        }
      }

      const purchasePatterns = [...productTotals.values()]
        .sort((a, b) => b.quantity - a.quantity || b.purchases - a.purchases)
        .slice(0, 100);

      // Derive behavioural signals from completed purchase history without introducing
      // an AI prediction layer. These signals are descriptive and become inputs to
      // later recommendation / forecasting intelligence.
      const productPurchases = new Map<string, Array<{ at: string; quantity: number }>>();
      for (const order of purchaseHistory) {
        for (const item of order.items) {
          const key = item.product_id ?? item.product_name;
          const entries = productPurchases.get(key) ?? [];
          entries.push({ at: item.created_at ?? order.created_at, quantity: Number(item.quantity) });
          productPurchases.set(key, entries);
        }
      }

      const recurringPurchases = [...productPurchases.entries()]
        .map(([key, entries]) => {
          const sorted = entries.slice().sort((a, b) => a.at.localeCompare(b.at));
          const intervals: number[] = [];
          for (let i = 1; i < sorted.length; i += 1) {
            const days = (Date.parse(sorted[i].at) - Date.parse(sorted[i - 1].at)) / 86400000;
            if (Number.isFinite(days) && days > 0) intervals.push(days);
          }
          if (intervals.length < 1) return null;
          const averageIntervalDays = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
          const recentIntervals = intervals.slice(-3);
          const intervalSpread = recentIntervals.length > 1
            ? Math.max(...recentIntervals) - Math.min(...recentIntervals)
            : 0;
          const consistency = Math.max(0, Math.min(1, 1 - (intervalSpread / Math.max(averageIntervalDays, 1))));
          const lastPurchase = sorted[sorted.length - 1];
          const averageQuantity = sorted.reduce((sum, entry) => sum + entry.quantity, 0) / sorted.length;
          const nextExpectedAt = new Date(Date.parse(lastPurchase.at) + averageIntervalDays * 86400000).toISOString();
          const pattern = purchasePatterns.find(item => (item.productId ?? item.productName) === key);
          const confidence = Math.max(0, Math.min(1, (Math.min(sorted.length, 6) / 6) * 0.7 + consistency * 0.3));

          return {
            productId: pattern?.productId ?? null,
            productName: pattern?.productName ?? key,
            purchaseCount: sorted.length,
            averageQuantity: Number(averageQuantity.toFixed(2)),
            averageIntervalDays: Number(averageIntervalDays.toFixed(1)),
            lastPurchasedAt: lastPurchase.at,
            nextExpectedAt,
            confidence: Number(confidence.toFixed(2)),
            classification: confidence >= 0.65 && averageIntervalDays <= 90 ? 'recurring' : 'emerging',
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => Date.parse(a.nextExpectedAt) - Date.parse(b.nextExpectedAt))
        .slice(0, 100);

      const consumptionSignals = recurringPurchases.map(item => ({
        ...item,
        signal: item.classification === 'recurring'
          ? 'regular_household_purchase'
          : 'repeat_purchase_pattern',
      }));

      const recurringByProductId = new Map(
        recurringPurchases
          .filter(item => item.productId)
          .map(item => [item.productId as string, item]),
      );
      const pantryItems = pantry.map(item => {
        const recurring = item.product_id ? recurringByProductId.get(item.product_id) : undefined;
        const quantity = Number(item.quantity ?? 0);
        const state = item.status ?? (quantity <= 0 ? 'depleted' : 'available');
        return {
          ...item,
          quantity,
          state,
          needsAttention: state === 'low' || state === 'depleted',
          recurringPurchase: recurring
            ? {
                averageQuantity: recurring.averageQuantity,
                averageIntervalDays: recurring.averageIntervalDays,
                nextExpectedAt: recurring.nextExpectedAt,
                confidence: recurring.confidence,
              }
            : null,
        };
      });
      const pantrySummary = {
        itemCount: pantryItems.length,
        availableCount: pantryItems.filter(item => item.state === 'available').length,
        lowCount: pantryItems.filter(item => item.state === 'low').length,
        depletedCount: pantryItems.filter(item => item.state === 'depleted').length,
        needsAttentionCount: pantryItems.filter(item => item.needsAttention).length,
        recurringLinkedCount: pantryItems.filter(item => item.recurringPurchase).length,
      };

      return json(res, 200, {
        household,
        memberCount: memberIds.length,
        preferences: preferences[0] ?? null,
        shoppingLists: lists,
        shoppingListSummary,
        pantry: pantryItems,
        pantrySummary,
        purchaseHistory,
        purchasePatterns,
        recurringPurchases,
        consumptionSignals,
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const requestedName = typeof body.name === 'string' ? body.name.trim() : '';
    const existing = await householdForCustomer(customerId);
    if (existing) return json(res, 409, { error: { code: 'HOUSEHOLD_EXISTS', message: 'The authenticated customer already belongs to an active household.', household: existing } });

    const created = await supabase<Row[]>('households', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ name: requestedName || null }),
    });
    const household = created[0];
    if (!household?.id) throw new Error('Household creation returned no household.');

    try {
      await supabase('household_memberships', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ household_id: household.id, customer_id: customerId, role: 'owner', status: 'active' }),
      });
      await supabase('household_preferences', {
        method: 'POST',
        body: JSON.stringify({ household_id: household.id }),
      });
    } catch (error) {
      await supabase('households?id=eq.' + encodeURIComponent(household.id), { method: 'DELETE' }).catch(() => undefined);
      throw error;
    }

    return json(res, 201, {
      household: { id: household.id, name: household.name, status: household.status, role: 'owner' },
      preferences: { household_id: household.id },
      shoppingLists: [],
      pantry: [],
    });
  } catch (error) {
    console.error('household-api error', error);
    return json(res, 500, { error: { code: 'HOUSEHOLD_INTERNAL_ERROR', message: error instanceof Error ? error.message : 'Household service unavailable.' } });
  }
}
