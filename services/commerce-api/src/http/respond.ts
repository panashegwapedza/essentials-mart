import type { ServerResponse } from "node:http";
import { CommerceError } from "../commerce.js";

export type ApiErrorBody = { error: { code: string; message: string } };

const STATUS_BY_CODE: Record<string, number> = {
  BASKET_EMPTY: 400,
  INVALID_QUANTITY: 400,
  VALIDATION_ERROR: 400,
  INVALID_PATH_PARAMETER: 400,
  UNAUTHENTICATED: 401,
  NOT_FOUND: 404,
  LINE_NOT_FOUND: 404,
  BASKET_OWNERSHIP_VIOLATION: 404,
  METHOD_NOT_ALLOWED: 405,
  PRODUCT_UNAVAILABLE: 409,
  MIXED_CURRENCY: 409,
  STALE_PRICE: 409,
  COMMERCE_ERROR: 400,
  UNSUPPORTED_MEDIA_TYPE: 415,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL: 500,
};

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function sendError(res: ServerResponse, code: string, message: string, status = STATUS_BY_CODE[code] ?? 500): void {
  sendJson(res, status, { error: { code, message } });
}

export function sendErrorFromException(res: ServerResponse, err: unknown): void {
  if (err instanceof CommerceError) {
    const message = err.message;
    if (message === "Basket must contain at least one item") return sendError(res, "BASKET_EMPTY", message);
    if (message === "Quantity must be a positive integer") return sendError(res, "INVALID_QUANTITY", message);
    if (message === "Basket contains mixed currencies") return sendError(res, "MIXED_CURRENCY", message);
    if (message.startsWith("Basket price is stale:")) return sendError(res, "STALE_PRICE", message, 409);
    if (message.startsWith("Product unavailable:")) return sendError(res, "PRODUCT_UNAVAILABLE", message, 409);
    if (message.startsWith("Product not found:") || message.startsWith("Order not found:")) return sendError(res, "NOT_FOUND", message, 404);
    if (message.startsWith("Basket has no line for product:")) return sendError(res, "LINE_NOT_FOUND", message, 404);
    return sendError(res, "COMMERCE_ERROR", message, 400);
  }

  console.error(err);
  sendError(res, "INTERNAL", "Internal server error.", 500);
}
