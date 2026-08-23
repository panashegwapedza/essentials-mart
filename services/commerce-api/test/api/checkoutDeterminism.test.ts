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

test("system remains healthy and structurally valid after concurrent checkout attempts (NOT a proof of atomicity)", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const headers = { ...devAuthHeaders("customer-1"), "Content-Type": "application/json" };
    await fetch(`${baseUrl}/basket/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId: "bread", quantity: 1 }),
    });

    // This deliberately does NOT assert "exactly one succeeds" — the
    // current InMemoryCheckoutTransaction provides no real isolation, so
    // that guarantee does not hold. Asserting it here would misrepresent
    // the development adapter as production-safe. What CAN be verified
    // today is that the server stays responsive and every response is
    // well-formed, and that once the dust settles the basket is in a
    // structurally valid state (not corrupted, not undefined) — those are
    // real, currently-true properties, not aspirational ones.
    const [a, b] = await Promise.all([
      fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") }),
      fetch(`${baseUrl}/checkout`, { method: "POST", headers: devAuthHeaders("customer-1") }),
    ]);

    for (const res of [a, b]) {
      assert.ok([201, 400, 409].includes(res.status), `unexpected status ${res.status}`);
      const body = await res.json();
      if (res.status === 201) {
        assert.equal(typeof body.id, "string");
        assert.equal(typeof body.total.amountMinor, "number");
      } else {
        assert.equal(typeof body.error.code, "string");
      }
    }

    // The server must still be responsive and return a well-formed basket,
    // not a hung connection or a corrupted/undefined shape.
    const basketRes = await fetch(`${baseUrl}/basket`, { headers: devAuthHeaders("customer-1") });
    assert.equal(basketRes.status, 200);
    const basket = await basketRes.json();
    assert.ok(Array.isArray(basket.lines), "basket.lines must remain a well-formed array after concurrent checkout attempts");
  } finally {
    await close(server);
  }
});
