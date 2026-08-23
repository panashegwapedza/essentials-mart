import { pathToFileURL } from "node:url";
import { InMemoryProductRepository } from "./adapters/dev/InMemoryProductRepository.js";
import { InMemoryBasketRepository } from "./adapters/dev/InMemoryBasketRepository.js";
import { InMemoryOrderRepository } from "./adapters/dev/InMemoryOrderRepository.js";
import { InMemoryCheckoutTransaction } from "./adapters/dev/InMemoryCheckoutTransaction.js";
import { resolveAuthProvider, AuthConfigurationError } from "./composition/resolveAuthProvider.js";
import { CommerceApplicationService } from "./application/CommerceApplicationService.js";
import { createServer } from "./http/createServer.js";

export function main() {
  let auth;
  try {
    auth = resolveAuthProvider(process.env);
  } catch (err) {
    if (err instanceof AuthConfigurationError) {
      console.error(`FATAL: refusing to start — ${err.message}`);
      process.exitCode = 1;
      return;
    }
    throw err;
  }

  const commerce = new CommerceApplicationService(
    new InMemoryProductRepository(InMemoryProductRepository.defaultSeed(process.env.DEV_FIXTURE_CURRENCY)),
    new InMemoryBasketRepository(),
    new InMemoryOrderRepository(),
    new InMemoryCheckoutTransaction(),
  );

  const server = createServer({ commerce, auth });
  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, () => console.log(`commerce-api listening on port ${port}`));
  return server;
}

// Only auto-run when this file is the actual process entrypoint (e.g.
// `node dist/src/index.js`), not when imported by something else (like the
// cross-platform dev bootstrap in devServer.ts).
//
// Uses pathToFileURL rather than naive `file://${process.argv[1]}` string
// concatenation — process.argv[1] is a raw OS path (unencoded, and on
// Windows uses backslashes + a drive letter), while import.meta.url is a
// properly percent-encoded URL. Naive concatenation silently fails to
// match on paths with spaces/unicode, and breaks entirely on Windows.
// pathToFileURL performs the correct OS-aware conversion.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
