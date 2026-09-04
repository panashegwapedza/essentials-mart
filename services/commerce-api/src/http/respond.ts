import type { ServerResponse } from "node:http";
import { CommerceError, type CommerceErrorCode } from "../commerce.js";
import { BuckPayError } from "../buckpay.js";

export type ApiErrorBody = { error: { code: string; message: string } };
type ApiErrorCode = CommerceErrorCode | "UNAUTHENTICATED" | "VALIDATION_ERROR" | "METHOD_NOT_ALLOWED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "INVALID_PATH_PARAMETER" | "INTERNAL" | BuckPayError["code"];
const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BASKET_EMPTY: 400, INVALID_QUANTITY: 400, VALIDATION_ERROR: 400, INVALID_PATH_PARAMETER: 400,
  UNAUTHENTICATED: 401, NOT_FOUND: 404, LINE_NOT_FOUND: 404, BASKET_OWNERSHIP_VIOLATION: 404,
  METHOD_NOT_ALLOWED: 405, PRODUCT_UNAVAILABLE: 409, MIXED_CURRENCY: 409, STALE_PRICE: 409, COMMERCE_ERROR: 400,
  INVALID_AMOUNT: 400, INVALID_CURRENCY: 409, INSUFFICIENT_BALANCE: 409, ACCOUNT_SUSPENDED: 423, DUPLICATE_REFERENCE: 409,
  UNSUPPORTED_MEDIA_TYPE: 415, PAYLOAD_TOO_LARGE: 413, INTERNAL: 500,
};

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function sendError(res: ServerResponse, code: string, message: string, status?: number): void {
  const resolvedStatus = status ?? STATUS_BY_CODE[code as ApiErrorCode] ?? 500;
  sendJson(res, resolvedStatus, { error: { code, message } });
}

export function sendErrorFromException(res: ServerResponse, err: unknown): void {
  if (err instanceof CommerceError || err instanceof BuckPayError) {
    sendError(res, err.code, err.message);
    return;
  }
  console.error(err);
  sendError(res, "INTERNAL", "Internal server error.", 500);
}
