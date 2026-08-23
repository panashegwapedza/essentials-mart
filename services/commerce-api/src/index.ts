import { InMemoryProductRepository } from "./adapters/dev/InMemoryProductRepository.js";
import { InMemoryBasketRepository } from "./adapters/dev/InMemoryBasketRepository.js";
import { InMemoryOrderRepository } from "./adapters/dev/InMemoryOrderRepository.js";
import { InMemoryCheckoutTransaction } from "./adapters/dev/InMemoryCheckoutTransaction.js";
import { resolveAuthProvider, AuthConfigurationError } from "./composition/resolveAuthProvider.js";
import { CommerceApplicationService } from "./application/CommerceApplicationService.js";
import { createServer } from "./http/createServer.js";

function main() {
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
    new InMemoryProductRepository(),
    new InMemoryBasketRepository(),
    new InMemoryOrderRepository(),
    new InMemoryCheckoutTransaction(),
  );

  const server = createServer({ commerce, auth });
  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, () => console.log(`commerce-api listening on port ${port}`));
}

main();
