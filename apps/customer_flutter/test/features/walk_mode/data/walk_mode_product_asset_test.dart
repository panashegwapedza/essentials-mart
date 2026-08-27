import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/features/walk_mode/data/walk_mode_product_asset.dart';

void main() {
  const validator = WalkModeProductAssetValidator();

  test('high fidelity asset requires a 3D representation', () {
    const asset = WalkModeProductAsset(
      assetId: 'asset-1',
      productId: 'cotton-wool',
      version: '1',
      fidelity: WalkModeAssetFidelity.high,
    );

    expect(validator.validate(asset), '3D asset is required for this fidelity level.');
  });

  test('valid high fidelity asset preserves product identity and 3D asset', () {
    const asset = WalkModeProductAsset(
      assetId: 'asset-1',
      productId: 'cotton-wool',
      version: '1',
      fidelity: WalkModeAssetFidelity.high,
      model3dUri: 'asset://cotton-wool.glb',
      arAssetUri: 'asset://cotton-wool-ar',
    );

    expect(validator.validate(asset), isNull);
    expect(asset.productId, 'cotton-wool');
    expect(asset.has3d, isTrue);
    expect(asset.hasAr, isTrue);
  });

  test('unavailable asset is a valid explicit fallback state', () {
    const asset = WalkModeProductAsset(
      assetId: 'asset-1',
      productId: 'cotton-wool',
      version: '1',
      fidelity: WalkModeAssetFidelity.unavailable,
    );

    expect(validator.validate(asset), isNull);
  });
}
