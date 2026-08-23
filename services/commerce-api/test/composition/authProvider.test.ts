import test from "node:test";
import assert from "node:assert/strict";
import { resolveAuthProvider, AuthConfigurationError } from "../../src/composition/resolveAuthProvider.js";
import { DevHeaderAuthProvider } from "../../src/adapters/dev/DevHeaderAuthProvider.js";

test("missing auth configuration fails closed", () => {
  assert.throws(() => resolveAuthProvider({}), AuthConfigurationError);
});

test("production auth fails closed until a production provider exists", () => {
  assert.throws(() => resolveAuthProvider({ AUTH_MODE: "production" }), AuthConfigurationError);
  assert.throws(() => resolveAuthProvider({ AUTH_MODE: "production", ALLOW_DEV_AUTH: "true" }), AuthConfigurationError);
});

test("development auth requires explicit second opt-in", () => {
  assert.throws(() => resolveAuthProvider({ AUTH_MODE: "development" }), AuthConfigurationError);
  assert.throws(() => resolveAuthProvider({ AUTH_MODE: "development", ALLOW_DEV_AUTH: "false" }), AuthConfigurationError);
  assert.ok(resolveAuthProvider({ AUTH_MODE: "development", ALLOW_DEV_AUTH: "true" }) instanceof DevHeaderAuthProvider);
});
