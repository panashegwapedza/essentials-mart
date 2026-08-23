import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";
import { DEV_FIXTURE_CURRENCY } from "../../src/adapters/dev/InMemoryProductRepository.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("POST /checkout creates an order with a server-calculated total", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "milk", quantity: 1 }),
    });

    const res = await fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") });
    assert.equal(res.status, 201);
    const order = await res.json();
    assert.equal(order.status, "placed");
    assert.equal(order.total.amountMinor, 550);
    assert.equal(order.total.currency, DEV_FIXTURE_CURRENCY);
  } finally {
    await close(server);
  }
});

test("checkout ignores a client-supplied total", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "bread", quantity: 2 }),
    });
    const res = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" },
      body: JSON.stringify({ total: { amountMinor: 1, currency: DEV_FIXTURE_CURRENCY } }),
    });
    assert.equal(res.status, 201);
    const order = await res.json();
    assert.equal(order.total.amountMinor, 500);
  } finally {
    await close(server);
  }
});
