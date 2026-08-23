import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryProductRepository, DEV_FIXTURE_CURRENCY } from "../../src/adapters/dev/InMemoryProductRepository.js";

test("fixtures are explicitly labelled and use an explicit test currency", async () => {
  const products = await new InMemoryProductRepository().list();
  assert.ok(products.length > 0);
  assert.ok(products.every((product) => product.name.includes("[DEV FIXTURE]")));
  assert.equal(DEV_FIXTURE_CURRENCY, "ZWG");
  assert.ok(products.every((product) => product.price.currency === DEV_FIXTURE_CURRENCY));
});

test("fixture currency can be overridden without changing domain code", async () => {
  const original = process.env.DEV_FIXTURE_CURRENCY;
  process.env.DEV_FIXTURE_CURRENCY = "TESTCUR";
  try {
    const products = await new InMemoryProductRepository().list();
    assert.ok(products.every((product) => product.price.currency === "TESTCUR"));
  } finally {
    if (original === undefined) delete process.env.DEV_FIXTURE_CURRENCY;
    else process.env.DEV_FIXTURE_CURRENCY = original;
  }
});
