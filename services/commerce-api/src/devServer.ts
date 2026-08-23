/**
 * LOCAL DEVELOPMENT CONVENIENCE ENTRYPOINT — NOT FOR PRODUCTION USE.
 *
 * Sets the two explicit opt-in variables resolveAuthProvider() requires
 * (AUTH_MODE=development, ALLOW_DEV_AUTH=true) in code, then starts the
 * server via the same main() used by the real entrypoint (index.ts).
 *
 * This exists so `npm run dev` works identically on macOS, Linux, and
 * Windows without relying on POSIX-only inline shell syntax like
 * `AUTH_MODE=development node index.js`, which fails under Windows'
 * cmd.exe (npm's default shell on Windows). Only sets a value if one isn't
 * already present, so an explicit different configuration is never silently
 * overridden.
 */
process.env.AUTH_MODE ??= "development";
process.env.ALLOW_DEV_AUTH ??= "true";

const { main } = await import("./index.js");
main();
