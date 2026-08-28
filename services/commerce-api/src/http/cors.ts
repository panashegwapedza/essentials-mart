import type { IncomingMessage, ServerResponse } from "node:http";

const CORS_METHODS = "GET, POST, DELETE, OPTIONS";
const CORS_HEADERS = "Content-Type, Authorization, X-Dev-Customer-Id";

const isAllowedDevOrigin = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

export function applyCors(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers.origin;
  if (typeof origin !== "string" || !isAllowedDevOrigin(origin)) {
    return false;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", CORS_METHODS);
  res.setHeader("Access-Control-Allow-Headers", CORS_HEADERS);
  return true;
}
