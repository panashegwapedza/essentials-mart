import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("invalid URI encoding returns 400", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/products/%ZZ`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error.code, "INVALID_PATH_PARAMETER");
    assert.ok(!("stack" in body.error));
  } finally {
    await close(server);
  }
});

test("unsupported method returns 405 with Allow", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/products`, { method: "PUT" });
    assert.equal(res.status, 405);
    assert.equal(res.headers.get("allow"), "GET");
    assert.equal((await res.json()).error.code, "METHOD_NOT_ALLOWED");
  } finally {
    await close(server);
  }
});

test("unsupported content type returns 415", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "text/plain" },
      body: "x",
    });
    assert.equal(res.status, 415);
    assert.equal((await res.json()).error.code, "UNSUPPORTED_MEDIA_TYPE");
  } finally {
    await close(server);
  }
});

test("missing content type returns 415", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: devAuthHeaders("customer-1"),
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });
    assert.equal(res.status, 415);
  } finally {
    await close(server);
  }
});

test("oversized body returns 413 without socket destruction", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const huge = "x".repeat(70 * 1024);
    const res = await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "bread", quantity: 1, junk: huge }),
    });
    assert.equal(res.status, 413);
    assert.equal((await res.json()).error.code, "PAYLOAD_TOO_LARGE");
  } finally {
    await close(server);
  }
});

test("unknown route returns consistent 404", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error.code, "NOT_FOUND");
  } finally {
    await close(server);
  }
});
