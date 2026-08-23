import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("orders are not enumerable across customers", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers: { ...devAuthHeaders("customer-a"), "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });
    const created = await fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-a") });
    const order = await created.json();

    const other = await fetch(`${baseUrl}/orders/${order.id}`, { headers: devAuthHeaders("customer-b") });
    assert.equal(other.status, 404);
    assert.deepEqual(await other.json(), {
      error: { code: "NOT_FOUND", message: `Order not found: ${order.id}` },
    });
  } finally {
    await close(server);
  }
});
