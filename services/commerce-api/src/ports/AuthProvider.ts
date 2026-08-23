import type { IncomingHttpHeaders } from "node:http";
import type { AuthenticatedPrincipal } from "../domain.js";

export interface AuthProvider {
  resolvePrincipal(headers: IncomingHttpHeaders): AuthenticatedPrincipal | null;
}
