import test from "node:test";
import assert from "node:assert/strict";
import { BuckPayApplicationService } from "../src/application/BuckPayApplicationService.js";
import { BuckPayError, InMemoryBuckPayRepository } from "../src/buckpay.js";

const principal = { customerId: "customer-1" };
const zig = (amountMinor: number) => ({ amountMinor, currency: "ZiG" });

test("BuckPay starts with a zero active balance", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  assert.deepEqual(await service.getAccount(principal), {
    customerId: "customer-1",
    balance: zig(0),
    status: "active",
  });
});

test("earned value credits the account and appears in history", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  const transaction = await service.creditEarnedValue(principal, zig(1250), "reward:order-1");
  assert.equal(transaction.type, "earned_reward");
  assert.equal((await service.getAccount(principal)).balance.amountMinor, 1250);
  assert.equal((await service.getTransactions(principal)).length, 1);
});

test("duplicate references are idempotent for the same transaction", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  const first = await service.creditEarnedValue(principal, zig(500), "reward:order-2");
  const second = await service.creditEarnedValue(principal, zig(500), "reward:order-2");
  assert.equal(second.id, first.id);
  assert.equal((await service.getAccount(principal)).balance.amountMinor, 500);
  assert.equal((await service.getTransactions(principal)).length, 1);
});

test("duplicate references cannot be reused with different values", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  await service.creditEarnedValue(principal, zig(500), "reward:order-3");
  await assert.rejects(() => service.creditEarnedValue(principal, zig(600), "reward:order-3"), (error: unknown) => error instanceof BuckPayError && error.code === "DUPLICATE_REFERENCE");
});

test("redemption cannot drive the balance below zero", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  await assert.rejects(() => service.redeem(principal, zig(1), "redeem:order-1"), (error: unknown) => error instanceof BuckPayError && error.code === "INSUFFICIENT_BALANCE");
});

test("redemption consumes only the authorised BuckPay amount", async () => {
  const service = new BuckPayApplicationService(new InMemoryBuckPayRepository());
  await service.creditEarnedValue(principal, zig(1000), "reward:order-4");
  await service.redeem(principal, zig(350), "redeem:order-4");
  assert.equal((await service.getAccount(principal)).balance.amountMinor, 650);
});
