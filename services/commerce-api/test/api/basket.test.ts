import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("adding the same product merges quantity into one basket line", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const headers = { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" };
    await fetch(`${baseUrl}/basket/items`, { method: "POST", headers, body: JSON.stringify({ productId: "bread", quantity: 2 }) });
    const second = await fetch(`${baseUrl}/basket/items`, { method: "POST", headers, body: JSON.stringify({ productId: "bread", quantity: 3 }) });
    assert.equal(second.status, 201);
    const basket = await second.json();
    assert.equal(basket.lines.length, 1);
    assert.equal(basket.lines[0].quantity, 5);
  } finally {
    await close(server);
  }
});

test("missing authentication cannot read a basket", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/basket`);
    assert.equal(res.status, 401);
    assert.equal((await res.json()).error.code, "UNAUTHENTICATED");
  } finally {
    await close(server);
  }
});
