import type { CustomerId } from "../domain.js";

export type NotificationRecord = {
  id: string;
  customerId: CustomerId;
  type: string;
  title: string;
  body: string;
  aggregateType?: string;
  aggregateId?: string;
  actionType?: string;
  actionTarget?: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
};

export interface NotificationRepository {
  listForCustomer(customerId: CustomerId): Promise<NotificationRecord[]>;
  markRead(customerId: CustomerId, notificationId: string): Promise<NotificationRecord | null>;
}
