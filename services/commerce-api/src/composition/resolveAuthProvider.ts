import type { AuthProvider } from "../ports/AuthProvider.js";
import { DevHeaderAuthProvider } from "../adapters/dev/DevHeaderAuthProvider.js";

export class AuthConfigurationError extends Error {}

export type AuthEnv = {
  AUTH_MODE?: string;
  ALLOW_DEV_AUTH?: string;
};

export function resolveAuthProvider(env: AuthEnv): AuthProvider {
  if (env.AUTH_MODE === "development" && env.ALLOW_DEV_AUTH === "true") {
    return new DevHeaderAuthProvider();
  }

  if (env.AUTH_MODE === "production") {
    throw new AuthConfigurationError(
      "AUTH_MODE=production requested, but no production AuthProvider is implemented. Refusing to fall back to development authentication.",
    );
  }

  throw new AuthConfigurationError(
    `AUTH_MODE must be explicitly configured; received ${JSON.stringify(env.AUTH_MODE ?? null)}. Development requires ALLOW_DEV_AUTH=true.`,
  );
}
