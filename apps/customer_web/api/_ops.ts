import { principal as authPrincipal } from './_auth.js';

type RequestLike = any;

function bearer(req: RequestLike): string | null {
  const raw = req.headers?.authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string' || !/^Bearer\s+\S+$/i.test(value)) return null;
  return value.replace(/^Bearer\s+/i, '').trim();
}

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase operations API is not configured.');
  return { url: url.replace(/\/$/, ''), key };
}

async function supabase(req: RequestLike, path: string, init: RequestInit = {}) {
  const token = bearer(req);
  if (!token) return { status: 401, body: { error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } } };
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text }; }
  return { status: response.status, body };
}

function send(res: any, status: number, body: unknown) {
  return res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
}

export async function handleOperations(req: RequestLike, res: any, path: string) {
  if (!path.startsWith('/ops/')) return false;
  const principal = await authPrincipal(req);
  if (!principal) { send(res, 401, { error: { code: 'UNAUTHENTICATED', message: 'A valid Supabase Auth session is required.' } }); return true; }

  if (path.startsWith('/ops/dashboard/') && req.method === 'GET') {
    const storeId = path.slice('/ops/dashboard/'.length);
    if (!storeId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'storeId is required.' } });
    const result = await supabase(req, 'rpc/get_store_ops_dashboard', {
      method: 'POST',
      body: JSON.stringify({ p_store_id: storeId }),
    });
    return send(res, result.status, result.body);
  }

  if (path === '/ops/stores' && req.method === 'GET') {
    const result = await supabase(req, `stores?select=id,code,name,status,region,created_at,updated_at&order=name.asc`);
    return send(res, result.status, result.body ? { stores: result.body } : result.body);
  }

  if (path === '/ops/orders' && req.method === 'GET') {
    const storeId = typeof req.query?.storeId === 'string' ? req.query.storeId : '';
    const status = typeof req.query?.status === 'string' ? req.query.status : 'paid';
    if (!storeId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'storeId is required.' } });
    const result = await supabase(req, `orders?select=id,store_id,status,payment_status,created_at,updated_at&store_id=eq.${encodeURIComponent(storeId)}&status=eq.${encodeURIComponent(status)}&order=created_at.asc`);
    return send(res, result.status, result.body ? { orders: result.body } : result.body);
  }

  if (path === '/ops/fulfilments' && req.method === 'GET') {
    const result = await supabase(req, 'order_fulfilments?select=id,order_id,store_id,status,picker_auth_user_id,started_at,completed_at,handed_off_at,created_at,updated_at&order=created_at.desc');
    return send(res, result.status, result.body ? { fulfilments: result.body } : result.body);
  }

  if (path === '/ops/inventory' && req.method === 'GET') {
    const result = await supabase(req, 'inventory?select=store_id,product_id,quantity,reserved_quantity,updated_at&order=updated_at.desc');
    return send(res, result.status, result.body ? { inventory: result.body } : result.body);
  }

  if (path.startsWith('/ops/fulfilments/') && path.endsWith('/items') && req.method === 'GET') {
    const fulfilmentId = path.slice('/ops/fulfilments/'.length, -'/items'.length);
    if (!fulfilmentId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'fulfilmentId is required.' } });
    const result = await supabase(req, `order_fulfilment_items?select=id,fulfilment_id,order_item_id,requested_quantity,picked_quantity,status,substitution_product_id,substitution_quantity,notes,order_items(product_id,products(id,name))&fulfilment_id=eq.${encodeURIComponent(fulfilmentId)}&order_item_id=order_item_id`);
    return send(res, result.status, result.body ? { items: result.body } : result.body);
  }

  if (path.startsWith('/ops/fulfilments/') && req.method === 'POST') {
    const parts = path.split('/').filter(Boolean);
    const fulfilmentId = parts[2];
    if (parts.length === 3 && parts[2]) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!Number.isInteger(body?.pickedQuantity) || body.pickedQuantity < 0) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'pickedQuantity must be a non-negative integer.' } });
      const result = await supabase(req, 'rpc/record_fulfilment_item', {
        method: 'POST',
        body: JSON.stringify({
          p_fulfilment_item_id: fulfilmentId,
          p_picked_quantity: body.pickedQuantity,
          p_substitution_product_id: body.substitutionProductId ?? null,
          p_substitution_quantity: body.substitutionQuantity ?? null,
          p_notes: typeof body.notes === 'string' ? body.notes : null,
        }),
      });
      return send(res, result.status, result.body);
    }
  }

  if (path.startsWith('/ops/orders/') && path.endsWith('/fulfil') && req.method === 'POST') {
    const orderId = path.slice('/ops/orders/'.length, -'/fulfil'.length);
    if (!orderId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'orderId is required.' } });
    const result = await supabase(req, 'rpc/start_order_fulfilment', { method: 'POST', body: JSON.stringify({ p_order_id: orderId }) });
    return send(res, result.status, result.body);
  }

  if (path.startsWith('/ops/orders/') && path.endsWith('/complete') && req.method === 'POST') {
    const orderId = path.slice('/ops/orders/'.length, -'/complete'.length);
    if (!orderId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'orderId is required.' } });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await supabase(req, 'rpc/complete_order_fulfilment', {
      method: 'POST',
      body: JSON.stringify({ p_order_id: orderId, p_hand_off: body?.handOff === true }),
    });
    return send(res, result.status, result.body);
  }

  if (path.startsWith('/ops/orders/') && path.endsWith('/delivery-status') && req.method === 'POST') {
    const orderId = path.slice('/ops/orders/'.length, -'/delivery-status'.length);
    if (!orderId) return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'orderId is required.' } });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (typeof body?.status !== 'string') {
      return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'status is required.' } });
    }
    const result = await supabase(req, 'rpc/update_delivery_status', {
      method: 'POST',
      body: JSON.stringify({
        p_order_id: orderId,
        p_status: body.status,
        p_tracking_reference: typeof body.trackingReference === 'string' ? body.trackingReference : null,
      }),
    });
    return send(res, result.status, result.body);
  }

  if (path.startsWith('/ops/inventory/') && req.method === 'POST') {
    const productId = path.slice('/ops/inventory/'.length);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!Number.isInteger(body?.quantityDelta) || body.quantityDelta === 0 || typeof body?.storeId !== 'string' || typeof body?.reason !== 'string') {
      return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'storeId, reason and non-zero integer quantityDelta are required.' } });
    }
    const result = await supabase(req, 'rpc/adjust_store_inventory', {
      method: 'POST',
      body: JSON.stringify({
        p_store_id: body.storeId,
        p_product_id: productId,
        p_quantity_delta: body.quantityDelta,
        p_reason: body.reason,
        p_reference_type: typeof body.referenceType === 'string' ? body.referenceType : null,
        p_reference_id: typeof body.referenceId === 'string' ? body.referenceId : null,
      }),
    });
    return send(res, result.status, result.body);
  }

  return send(res, 404, { error: { code: 'NOT_FOUND', message: 'No such operations route.' } });
}
