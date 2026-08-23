import type { AddressInfo } from "node:net";
import { InMemoryProductRepository } from "../../src/adapters/dev/InMemoryProductRepository.js";
import { InMemoryBasketRepository } from "../../src/adapters/dev/InMemoryBasketRepository.js";
import { InMemoryOrderRepository } from "../../src/adapters/dev/InMemoryOrderRepository.js";
import { InMemoryCheckoutTransaction } from "../../src/adapters/dev/InMemoryCheckoutTransaction.js";
import { DevHeaderAuthProvider } from "../../src/adapters/dev/DevHeaderAuthProvider.js";
import { CommerceApplicationService } from "../../src/application/CommerceApplicationService.js";
import { createServer } from "../../src/http/createServer.js";
import type { Product } from "../../src/domain.js";

export const devAuthHeaders = (customerId: string) => ({ "x-dev-customer-id": customerId });

export async function startTestServer(productSeed?: Product[]) {
  const commerce = new CommerceApplicationService(
    new InMemoryProductRepository(productSeed),
    new InMemoryBasketRepository(),
    new InMemoryOrderRepository(),
    new InMemoryCheckoutTransaction(),
  );
  const server = createServer({ commerce, auth: new DevHeaderAuthProvider() });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}
