import type { IncomingHttpHeaders } from "node:http";
import type { AuthenticatedPrincipal } from "../../domain.js";
import type { AuthProvider } from "../../ports/AuthProvider.js";

export class DevHeaderAuthProvider implements AuthProvider {
  resolvePrincipal(headers: IncomingHttpHeaders): AuthenticatedPrincipal | null {
    const raw = headers["x-dev-customer-id"];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value !== "string" || value.trim() === "") return null;
    return { customerId: value };
  }
}
