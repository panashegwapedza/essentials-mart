import type { CustomerId } from "../../domain.js";
import type { NotificationRecord, NotificationRepository } from "../../ports/NotificationRepository.js";
import { supabaseRest } from "./SupabaseCommerceRepositories.js";

function map(row: any): NotificationRecord {
  return {
    id: row.id,
    customerId: row.customers?.external_customer_id ?? row.customer_id,
    type: row.type,
    title: row.title,
    body: row.body,
    aggregateType: row.aggregate_type ?? undefined,
    aggregateId: row.aggregate_id ?? undefined,
    actionType: row.action_type ?? undefined,
    actionTarget: row.action_target ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export class SupabaseNotificationRepository implements NotificationRepository {
  async listForCustomer(customerId: CustomerId) {
    const rows = await supabaseRest<any[]>(
      `notifications?select=id,customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,status,created_at,customers!inner(external_customer_id)&customers.external_customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&limit=50`,
    );
    return rows.map(map);
  }

  async markRead(customerId: CustomerId, notificationId: string) {
    const rows = await supabaseRest<any[]>(
      `notifications?select=id,customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,status,created_at,customers!inner(external_customer_id)&id=eq.${encodeURIComponent(notificationId)}&customers.external_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
    );
    if (!rows[0]) return null;
    const updated = await supabaseRest<any[]>(
      `notifications?id=eq.${encodeURIComponent(notificationId)}&customer_id=eq.${encodeURIComponent(rows[0].customer_id)}`,
      { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: "read", read_at: new Date().toISOString() }) },
    );
    return updated[0] ? map({ ...updated[0], customers: { external_customer_id: customerId } }) : null;
  }
}
