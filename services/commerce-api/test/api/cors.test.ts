import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("allows localhost browser requests and exposes the CORS contract", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const origin = "http://localhost:5173";
    const res = await fetch(`${baseUrl}/products`, {
      headers: { Origin: origin },
    });

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("access-control-allow-origin"), origin);
    assert.equal(res.headers.get("vary"), "Origin");
  } finally {
    await close(server);
  }
});

test("answers localhost preflight requests without bypassing authentication", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const origin = "http://127.0.0.1:56252";
    const res = await fetch(`${baseUrl}/basket`, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization,content-type",
      },
    });

    assert.equal(res.status, 204);
    assert.equal(res.headers.get("access-control-allow-origin"), origin);
    assert.match(res.headers.get("access-control-allow-methods") ?? "", /GET/);
    assert.match(res.headers.get("access-control-allow-headers") ?? "", /Authorization/);
  } finally {
    await close(server);
  }
});

test("does not allow arbitrary origins", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/products`, {
      headers: { Origin: "https://example.com" },
    });

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("access-control-allow-origin"), null);
  } finally {
    await close(server);
  }
});
