import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_models.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_product_asset.dart';
import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_spatial_discovery.dart';

void main() {
  const discovery = WalkModeSpatialDiscovery(visibilityRadius: 3);
  const position = WalkModeSpatialPosition(x: 0, y: 0);

  test('discovers products inside the spatial visibility radius', () {
    final aisle = _aisle([
      _placement('near', 1, 0),
      _placement('far', 5, 0),
    ]);

    final result = discovery.discover(
      aisle: aisle,
      customerPosition: position,
    );

    expect(result.map((item) => item.product.id), ['near']);
  });

  test('orders discovered products nearest first', () {
    final aisle = _aisle([
      _placement('far', 2.5, 0),
      _placement('near', 1, 0),
      _placement('middle', 2, 0),
    ]);

    final result = discovery.discover(
      aisle: aisle,
      customerPosition: position,
    );

    expect(result.map((item) => item.product.id), ['near', 'middle', 'far']);
  });

  test('discovery does not depend on product availability', () {
    final unavailable = _placement('unavailable', 1, 0, available: false);

    final result = discovery.discover(
      aisle: _aisle([unavailable]),
      customerPosition: position,
    );

    expect(result.single.product.id, 'unavailable');
    expect(result.single.product.available, isFalse);
  });

  test('discovery is spatial visibility, not AI recommendation', () {
    final result = discovery.discover(
      aisle: _aisle([_placement('cotton-wool', 1, 0)]),
      customerPosition: position,
    );

    expect(result, hasLength(1));
    expect(result.single.product.id, 'cotton-wool');
  });
}

WalkModeAisle _aisle(List<WalkModeProductPlacement> products) {
  return WalkModeAisle(
    id: 'household',
    name: 'Household',
    products: products,
  );
}

WalkModeProductPlacement _placement(
  String id,
  double x,
  double y, {
  bool available = true,
}) {
  return WalkModeProductPlacement(
    product: Product(
      id: id,
      name: id,
      amountMinor: 100,
      currency: 'TEST',
      available: available,
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
