import { pathToFileURL } from "node:url";
import { InMemoryProductRepository } from "./adapters/dev/InMemoryProductRepository.js";
import { InMemoryBasketRepository } from "./adapters/dev/InMemoryBasketRepository.js";
import { InMemoryOrderRepository } from "./adapters/dev/InMemoryOrderRepository.js";
import { InMemoryCheckoutTransaction } from "./adapters/dev/InMemoryCheckoutTransaction.js";
import { InMemoryBuckPayRepository } from "./buckpay.js";
import { resolveAuthProvider, AuthConfigurationError } from "./composition/resolveAuthProvider.js";
import { CommerceApplicationService } from "./application/CommerceApplicationService.js";
import { BuckPayApplicationService } from "./application/BuckPayApplicationService.js";
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
  const buckPay = new BuckPayApplicationService(new InMemoryBuckPayRepository());

  const server = createServer({ commerce, buckPay, auth });
  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, () => console.log(`commerce-api listening on port ${port}`));
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
