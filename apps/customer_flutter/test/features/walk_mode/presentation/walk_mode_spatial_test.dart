import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_product_asset.dart';
import 'package:essentials_mart_customer/features/walk_mode/presentation/walk_mode_controller.dart';

void main() {
  test('Walk Mode enters an authoritative store aisle with a validated asset', () {
    const asset = WalkModeProductAsset(
      assetId: 'asset-cotton-wool-v1',
      productId: 'cotton-wool',
      version: '1',
      fidelity: WalkModeAssetFidelity.high,
      model3dUri: 'asset://cotton-wool.glb',
      arAssetUri: 'asset://cotton-wool-ar',
    );

    expect(const WalkModeProductAssetValidator().validate(asset), isNull);

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
                asset: asset,
              ),
            ],
          ),
        ],
      ),
    );

    controller.enterAisle('household');

    final placement = controller.currentAisle?.products.single;
    expect(controller.currentAisle?.id, 'household');
    expect(placement?.product.name, 'Cotton Wool');
    expect(placement?.asset.productId, placement?.product.id);
    expect(placement?.asset.has3d, isTrue);
    expect(placement?.asset.hasAr, isTrue);
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
