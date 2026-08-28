import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_product_asset.dart';
import 'package:essentials_mart_customer/features/walk_mode/presentation/walk_mode_controller.dart';

void main() {
  test('Walk Mode reads basket state from the shared capability', () async {
    final basket = Basket.fromJson({
      'id': 'basket-1',
      'lines': [
        {
          'productId': 'bread',
          'quantity': 2,
          'unitPrice': {'amountMinor': 250, 'currency': 'USD'},
        },
      ],
    });
    final capability = BasketCapability(_FakeBasketRepository(basket));
    final controller = WalkModeController(capability);

    await capability.load();

    expect(controller.basketItemCount, 2);
  });

  test('Walk Mode delegates basket mutations to the shared capability', () async {
    final initial = Basket.fromJson({'id': 'basket-1', 'lines': []});
    final updated = Basket.fromJson({
      'id': 'basket-1',
      'lines': [
        {
          'productId': 'milk',
          'quantity': 1,
          'unitPrice': {'amountMinor': 300, 'currency': 'USD'},
        },
      ],
    });
    final capability = BasketCapability(
      _FakeBasketRepository(initial, updatedBasket: updated),
    );
    final controller = WalkModeController(capability);

    await controller.addToBasket('milk');

    expect(controller.basketItemCount, 1);
  });

  test('Walk Mode exposes only products within the current spatial context', () {
    final controller = WalkModeController(
      BasketCapability(_FakeBasketRepository()),
      storeMap: WalkModeStoreMap(
        storeId: 'store-1',
        layoutVersion: 'layout-1',
        aisles: [
          WalkModeAisle(
            id: 'household',
            name: 'Household',
            products: [
              _placement('cotton-wool', 1, 0),
              _placement('methylated-spirit', 2, 0),
              _placement('far-item', 5, 0),
            ],
          ),
        ],
      ),
    );

    controller.enterAisle('household');
    controller.setSpatialPosition(
      const WalkModeSpatialPosition(x: 0, y: 0),
    );

    expect(
      controller.visibleProducts.map((placement) => placement.product.id),
      ['cotton-wool', 'methylated-spirit'],
    );
  });

  test('Walk Mode defaults to Manual and can change authority', () {
    final capability = BasketCapability(_FakeBasketRepository());
    final controller = WalkModeController(capability);

    expect(controller.mode, WalkModeType.manual);

    controller.setMode(WalkModeType.aiAssisted);

    expect(controller.mode, WalkModeType.aiAssisted);
  });
}

WalkModeProductPlacement _placement(String id, double x, double y) {
  return WalkModeProductPlacement(
    product: Product(
      id: id,
      name: id,
      amountMinor: 100,
      currency: 'TEST',
      available: true,
    ),
    position: WalkModeSpatialPosition(x: x, y: y),
    asset: WalkModeProductAsset(
      assetId: 'asset-$id',
      productId: id,
      version: '1',
      fidelity: WalkModeAssetFidelity.imageFallback,
    ),
  );
}

class _FakeBasketRepository implements BasketRepository {
  _FakeBasketRepository([
    this.basket = const Basket(id: 'basket-1', lines: []),
    this.updatedBasket,
  ]);

  Basket basket;
  final Basket? updatedBasket;

  @override
  Future<Basket> getBasket() async => basket;

  @override
  Future<Basket> addToBasket(String productId, int quantity) async {
    basket = updatedBasket ?? basket;
    return basket;
  }

  @override
  Future<Basket> removeFromBasket(String productId) async => basket;
}
