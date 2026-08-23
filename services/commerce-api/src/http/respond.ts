import type { ServerResponse } from "node:http";
import { CommerceError, type CommerceErrorCode } from "../commerce.js";

export type ApiErrorBody = { error: { code: string; message: string } };
const STATUS_BY_CODE: Record<CommerceErrorCode | "UNAUTHENTICATED" | "VALIDATION_ERROR" | "METHOD_NOT_ALLOWED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "INVALID_PATH_PARAMETER" | "INTERNAL", number> = {
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

export function sendError(res: ServerResponse, code: string, message: string, status?: number): void {
  const resolvedStatus = status ?? STATUS_BY_CODE[code as keyof typeof STATUS_BY_CODE] ?? 500;
  sendJson(res, resolvedStatus, { error: { code, message } });
}

/**
 * Maps a thrown error to an API response by reading the domain error's own
 * `code` field directly — never by matching on `err.message` text. Message
 * wording is free to change in commerce.ts without risk of silently
 * breaking HTTP status mapping.
 */
export function sendErrorFromException(res: ServerResponse, err: unknown): void {
  if (err instanceof CommerceError) {
    sendError(res, err.code, err.message);
    return;
  }

  console.error(err);
  sendError(res, "INTERNAL", "Internal server error.", 500);
}
