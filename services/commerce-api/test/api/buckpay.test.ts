import test from "node:test";
import assert from "node:assert/strict";
import { devAuthHeaders, startTestServer } from "./testServer.js";

async function close(server: import("node:http").Server) {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test("GET /buckpay returns only the authenticated customer's account", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/buckpay`, { headers: devAuthHeaders("customer-api") });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      customerId: "customer-api",
      balance: { amountMinor: 0, currency: "ZiG" },
      status: "active",
    });
  } finally { await close(server); }
});

test("BuckPay routes require authentication", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/buckpay`);
    assert.equal(response.status, 401);
  } finally { await close(server); }
});

test("GET /buckpay/transactions starts empty", async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/buckpay/transactions`, { headers: devAuthHeaders("customer-history") });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { transactions: [] });
  } finally { await close(server); }
});
