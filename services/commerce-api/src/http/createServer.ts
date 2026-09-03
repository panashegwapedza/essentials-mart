import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AuthenticatedPrincipal } from "../domain.js";
import type { AuthProvider } from "../ports/AuthProvider.js";
import type { CommerceApplicationService } from "../application/CommerceApplicationService.js";
import { readJsonBody, MalformedBodyError, RequestTooLargeError } from "./readJsonBody.js";
import { sendError, sendErrorFromException, sendJson } from "./respond.js";
import { toBasketDto, toOrderDto, toProductDto } from "./dto.js";

export type CreateServerDeps = {
  commerce: CommerceApplicationService;
  auth: AuthProvider;
};

class InvalidPathParameterError extends Error {}
const JSON_CONTENT_TYPE = "application/json";
const DEV_CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const hasJsonContentType = (req: IncomingMessage): boolean => {
  const raw = req.headers["content-type"];
  return typeof raw === "string" && raw.split(";", 1)[0].trim().toLowerCase() === JSON_CONTENT_TYPE;
};

const decodeParam = (raw: string): string => {
  try {
    return decodeURIComponent(raw);
  } catch {
    throw new InvalidPathParameterError("Path parameter is not validly URI-encoded.");
  }
};

const match = (pattern: RegExp, path: string): string[] | null => {
  const m = path.match(pattern);
  return m ? m.slice(1) : null;
};

export function createServer({ commerce, auth }: CreateServerDeps) {
  return createHttpServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", DEV_CORS_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-dev-customer-id");
    res.setHeader("Vary", "Origin");

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      await route(req, res, commerce, auth);
    } catch (err) {
      if (err instanceof InvalidPathParameterError) {
        sendError(res, "INVALID_PATH_PARAMETER", err.message, 400);
        return;
      }
      sendErrorFromException(res, err);
    }
  });
}

async function route(
  req: IncomingMessage,
  res: ServerResponse,
  commerce: CommerceApplicationService,
  auth: AuthProvider,
): Promise<void> {
  let path: string;
  try {
    path = new URL(req.url ?? "/", "http://internal").pathname;
  } catch {
    sendError(res, "INVALID_PATH_PARAMETER", "Request URI could not be parsed.", 400);
    return;
  }
  const method = req.method ?? "GET";

  if (path === "/products") {
    if (method !== "GET") return methodNotAllowed(res, ["GET"]);
    return sendJson(res, 200, { products: (await commerce.listProducts()).map(toProductDto) });
  }

  const productMatch = match(/^\/products\/([^/]+)$/, path);
  if (productMatch) {
    if (method !== "GET") return methodNotAllowed(res, ["GET"]);
    return sendJson(res, 200, toProductDto(await commerce.getProduct(decodeParam(productMatch[0]))));
  }

  const protectedRoute =
    path === "/basket" ||
    path === "/basket/items" ||
    /^\/basket\/items\/[^/]+$/.test(path) ||
    path === "/checkout" ||
    /^\/orders\/[^/]+$/.test(path);

  if (protectedRoute) {
    const principal = auth.resolvePrincipal(req.headers);
    if (!principal) {
      sendError(res, "UNAUTHENTICATED", "No authenticated principal could be resolved for this request.", 401);
      return;
    }

    if (path === "/basket") {
      if (method !== "GET") return methodNotAllowed(res, ["GET"]);
      return sendJson(res, 200, toBasketDto(await commerce.getOrCreateBasket(principal)));
    }

    if (path === "/basket/items") {
      if (method !== "POST") return methodNotAllowed(res, ["POST"]);
      await handleAddItem(req, res, commerce, principal);
      return;
    }

    const removeMatch = match(/^\/basket\/items\/([^/]+)$/, path);
    if (removeMatch) {
      if (method !== "DELETE") return methodNotAllowed(res, ["DELETE"]);
      return sendJson(res, 200, toBasketDto(await commerce.removeItem(principal, decodeParam(removeMatch[0]))));
    }

    if (path === "/checkout") {
      if (method !== "POST") return methodNotAllowed(res, ["POST"]);
      return sendJson(res, 201, toOrderDto(await commerce.checkout(principal)));
    }

    const orderMatch = match(/^\/orders\/([^/]+)$/, path);
    if (orderMatch) {
      if (method !== "GET") return methodNotAllowed(res, ["GET"]);
      return sendJson(res, 200, toOrderDto(await commerce.getOwnedOrder(principal, decodeParam(orderMatch[0]))));
    }
  }

  sendError(res, "NOT_FOUND", "No such route.", 404);
}

function methodNotAllowed(res: ServerResponse, allowed: string[]): void {
  res.setHeader("Allow", allowed.join(", "));
  sendError(res, "METHOD_NOT_ALLOWED", `Method not allowed. Allowed methods: ${allowed.join(", ")}`, 405);
}

async function handleAddItem(
  req: IncomingMessage,
  res: ServerResponse,
  commerce: CommerceApplicationService,
  principal: AuthenticatedPrincipal,
): Promise<void> {
  if (!hasJsonContentType(req)) {
    sendError(res, "UNSUPPORTED_MEDIA_TYPE", 'Content-Type must be "application/json".', 415);
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    if (err instanceof RequestTooLargeError) {
      sendError(res, "PAYLOAD_TOO_LARGE", err.message, 413);
      return;
    }
    if (err instanceof MalformedBodyError) {
      sendError(res, "VALIDATION_ERROR", err.message, 400);
      return;
    }
    throw err;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendError(res, "VALIDATION_ERROR", "Request body must be a JSON object.", 400);
    return;
  }

  const candidate = body as Record<string, unknown>;
  const productId = candidate.productId;
  const quantity = candidate.quantity;
  if (
    typeof productId !== "string" ||
    productId.trim() === "" ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    sendError(res, "VALIDATION_ERROR", "productId must be a non-empty string and quantity must be a positive integer.", 400);
    return;
  }

  const basket = await commerce.addItem(principal, productId, quantity);
  sendJson(res, 201, toBasketDto(basket));
}
