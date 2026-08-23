import type { IncomingMessage } from "node:http";

export class MalformedBodyError extends Error {}
export class RequestTooLargeError extends MalformedBodyError {}
export class RequestAbortedError extends MalformedBodyError {}

const MAX_BODY_BYTES = 64 * 1024;

export function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let received = 0;
    let settled = false;
    let tooLarge = false;
    const chunks: Buffer[] = [];
    const settle = (fn: () => void) => {
      if (!settled) {
        settled = true;
        fn();
      }
    };

    const declaredLength = Number(req.headers["content-length"] ?? "");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      tooLarge = true;
      req.resume();
      settle(() => reject(new RequestTooLargeError("Request body exceeds the maximum allowed size")));
      return;
    }

    req.on("data", (chunk: Buffer) => {
      if (settled) return;
      received += chunk.length;
      if (received > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        req.resume();
        settle(() => reject(new RequestTooLargeError("Request body exceeds the maximum allowed size")));
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });

    req.on("end", () => {
      settle(() => {
        const raw = Buffer.concat(chunks).toString("utf8").trim();
        if (!raw) return resolve({});
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new MalformedBodyError("Request body is not valid JSON"));
        }
      });
    });

    req.on("error", (err: unknown) => settle(() => reject(err)));
    req.on("close", () => settle(() => reject(new RequestAbortedError("Request was aborted before the body was fully received"))));
  });
}
