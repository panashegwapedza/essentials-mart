import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryProductRepository, DEV_FIXTURE_CURRENCY } from "../../src/adapters/dev/InMemoryProductRepository.js";

test("fixtures are explicitly labelled and use an explicit test currency", async () => {
  const products = await new InMemoryProductRepository().list();
  assert.ok(products.length > 0);
  assert.ok(products.every((product) => product.name.includes("[DEV FIXTURE]")));
  assert.equal(DEV_FIXTURE_CURRENCY, "ZiG");
  assert.ok(products.every((product) => product.price.currency === DEV_FIXTURE_CURRENCY));
});

test("fixture currency can be overridden by passing an explicit currency to defaultSeed() — no process.env mutation needed", async () => {
  const products = await new InMemoryProductRepository(InMemoryProductRepository.defaultSeed("TESTCUR")).list();
  assert.ok(products.every((product) => product.price.currency === "TESTCUR"));
});
