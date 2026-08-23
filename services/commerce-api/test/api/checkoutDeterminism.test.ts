import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

test("sequential checkouts are deterministic", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const headers = { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" };
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });
    const first = await fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") });
    assert.equal(first.status, 201);
    const second = await fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") });
    assert.equal(second.status, 400);
    assert.equal((await second.json()).error.code, "BASKET_EMPTY");
  } finally {
    await close(server);
  }
});

test("concurrent checkout safety is explicitly not claimed by the development adapter", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const headers = { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" };
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });
    const [a, b] = await Promise.all([
      fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") }),
      fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") }),
    ]);
    assert.ok([201, 400, 409].includes(a.status));
    assert.ok([201, 400, 409].includes(b.status));
  } finally {
    await close(server);
  }
});
