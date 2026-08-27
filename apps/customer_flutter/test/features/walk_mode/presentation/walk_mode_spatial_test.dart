import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/presentation/walk_mode_controller.dart';

void main() {
  test('Walk Mode enters an authoritative store aisle', () {
    final controller = WalkModeController(
      BasketCapability(_FakeBasketRepository()),
      storeMap: const WalkModeStoreMap(
        storeId: 'store-1',
        layoutVersion: 'layout-1',
        aisles: [
          WalkModeAisle(
            id: 'household',
            name: 'Household',
            products: [
              WalkModeProductPlacement(
                product: Product(
                  id: 'cotton-wool',
                  name: 'Cotton Wool',
                  amountMinor: 250,
                  currency: 'USD',
                  available: true,
                ),
                position: WalkModeSpatialPosition(x: 1, y: 2),
                model3dUri: 'asset://cotton-wool.glb',
                arAssetUri: 'asset://cotton-wool-ar',
              ),
            ],
          ),
        ],
      ),
    );

    controller.enterAisle('household');

    expect(controller.currentAisle?.id, 'household');
    expect(controller.currentAisle?.products.single.product.name, 'Cotton Wool');
    expect(controller.currentAisle?.products.single.model3dUri, contains('.glb'));
    expect(controller.currentAisle?.products.single.arAssetUri, isNotEmpty);
  });
}

class _FakeBasketRepository implements BasketRepository {
  @override
  Future<Basket> getBasket() async =>
      const Basket(id: 'basket-1', lines: []);

  @override
  Future<Basket> addToBasket(String productId, int quantity) async =>
      const Basket(id: 'basket-1', lines: []);

  @override
  Future<Basket> removeFromBasket(String productId) async =>
      const Basket(id: 'basket-1', lines: []);
}
