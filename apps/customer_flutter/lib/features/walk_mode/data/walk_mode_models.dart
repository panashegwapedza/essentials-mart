import '../../commerce/data/commerce_models.dart';
import 'walk_mode_product_asset.dart';

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

/// Connects authoritative product identity to its store-specific location
/// and its validated visual representation.
class WalkModeProductPlacement {
  const WalkModeProductPlacement({
    required this.product,
    required this.position,
    required this.asset,
  });

  final Product product;
  final WalkModeSpatialPosition position;
  final WalkModeProductAsset asset;
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
