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
      _FakeBasketRepository(initial, updated),
    );
    final controller = WalkModeController(capability);

    await controller.addToBasket('milk');

    expect(controller.basketItemCount, 1);
  });

  test('Walk Mode exposes only products within the current spatial context', () {
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

  test('Walk Mode records products encountered across movement', () {
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
              _placement('cotton-wool', 0, 0),
              _placement('methylated-spirit', 3.1, 0),
            ],
          ),
        ],
      ),
    );

    controller.enterAisle('household');
    controller.setSpatialPosition(
      const WalkModeSpatialPosition(x: 0, y: 0),
    );
    expect(controller.encounteredProductIds, contains('cotton-wool'));
    expect(controller.encounteredProductIds, isNot(contains('methylated-spirit')));

    controller.moveBy(dx: 3.1);

    expect(controller.encounteredProductIds, containsAll([
      'cotton-wool',
      'methylated-spirit',
    ]));
  });

  test('changing aisles starts a fresh encounter context', () {
    final controller = WalkModeController(
      BasketCapability(_FakeBasketRepository()),
      storeMap: const WalkModeStoreMap(
        storeId: 'store-1',
        layoutVersion: 'layout-1',
        aisles: [
          WalkModeAisle(
            id: 'one',
            name: 'One',
            products: [_placement('bread', 0, 0)],
          ),
          WalkModeAisle(
            id: 'two',
            name: 'Two',
            products: [_placement('milk', 0, 0)],
          ),
        ],
      ),
    );

    controller.enterAisle('one');
    controller.setSpatialPosition(
      const WalkModeSpatialPosition(x: 0, y: 0),
    );
    expect(controller.encounteredProductIds, contains('bread'));

    controller.enterAisle('two');

    expect(controller.encounteredProductIds, isEmpty);
  });

  test('Walk Mode exposes the next aisle and journey progress', () {
    final controller = WalkModeController(
      BasketCapability(_FakeBasketRepository()),
      storeMap: const WalkModeStoreMap(
        storeId: 'store-1',
        layoutVersion: 'layout-1',
        aisles: [
          WalkModeAisle(id: 'fresh', name: 'Fresh', products: const []),
          WalkModeAisle(id: 'pantry', name: 'Pantry', products: const []),
          WalkModeAisle(id: 'household', name: 'Household', products: const []),
        ],
      ),
    );

    expect(controller.journeyProgress, 0);
    expect(controller.nextAisle, isNull);

    controller.enterAisle('fresh');

    expect(controller.currentAisleIndex, 0);
    expect(controller.journeyProgress, closeTo(1 / 3, 0.0001));
    expect(controller.nextAisle?.id, 'pantry');
    expect(controller.journeyStatus, 'Fresh · next: Pantry');

    controller.enterAisle('household');

    expect(controller.currentAisleIndex, 2);
    expect(controller.journeyProgress, 1);
    expect(controller.nextAisle, isNull);
    expect(controller.journeyStatus, 'Household · final aisle');
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
