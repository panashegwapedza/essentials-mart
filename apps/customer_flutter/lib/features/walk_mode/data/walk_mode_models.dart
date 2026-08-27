import '../../commerce/data/commerce_models.dart';

/// A store-specific spatial representation consumed by Walk Mode.
///
/// The model is deliberately renderer-neutral: 2D, 3D and AR renderers may
/// consume the same authoritative spatial contract.
class WalkModeStoreMap {
  const WalkModeStoreMap({
    required this.storeId,
    required this.layoutVersion,
    required this.aisles,
  });

  final String storeId;
  final String layoutVersion;
  final List<WalkModeAisle> aisles;
}

class WalkModeAisle {
  const WalkModeAisle({
    required this.id,
    required this.name,
    required this.products,
  });

  final String id;
  final String name;
  final List<WalkModeProductPlacement> products;
}

/// Connects an authoritative product identity to its store-specific location
/// and required visual assets.
class WalkModeProductPlacement {
  const WalkModeProductPlacement({
    required this.product,
    required this.position,
    required this.model3dUri,
    required this.arAssetUri,
  });

  final Product product;
  final WalkModeSpatialPosition position;

  /// URI for the product's faithful 3D representation.
  final String model3dUri;

  /// URI for the product's AR-ready representation.
  final String arAssetUri;
}

class WalkModeSpatialPosition {
  const WalkModeSpatialPosition({
    required this.x,
    required this.y,
    this.z = 0,
  });

  final double x;
  final double y;
  final double z;
}
