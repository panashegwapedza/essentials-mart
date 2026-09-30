import type { AuthenticatedPrincipal } from "../domain.js";
import type { NotificationRecord, NotificationRepository } from "../ports/NotificationRepository.js";

export class NotificationApplicationService {
  constructor(private readonly repository: NotificationRepository) {}

  async list(principal: AuthenticatedPrincipal): Promise<NotificationRecord[]> {
    return this.repository.listForCustomer(principal.customerId, false);
  }

  async history(principal: AuthenticatedPrincipal): Promise<NotificationRecord[]> { return this.repository.listForCustomer(principal.customerId, true); }

  async markRead(principal: AuthenticatedPrincipal, notificationId: string): Promise<NotificationRecord> {
    const notification = await this.repository.markRead(principal.customerId, notificationId);
    if (!notification) throw Object.assign(new Error("Notification not found"), { code: "NOT_FOUND" });
    return notification;
  }

  async archive(principal: AuthenticatedPrincipal, notificationId: string): Promise<NotificationRecord> { const n=await this.repository.archive(principal.customerId,notificationId); if(!n) throw Object.assign(new Error("Notification not found"),{code:"NOT_FOUND"}); return n; }

  async archiveAll(principal: AuthenticatedPrincipal): Promise<void> { await this.repository.archiveAll(principal.customerId); }
}
