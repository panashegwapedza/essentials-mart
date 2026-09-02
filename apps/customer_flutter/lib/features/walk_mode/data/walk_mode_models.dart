import '../../commerce/data/commerce_models.dart';
import 'walk_mode_product_asset.dart';

/// Store-specific spatial contract consumed by Walk Mode renderers.
///
/// The development implementation is a realistic supermarket fixture. The
/// same contract is intended to be populated by the authoritative Store/Layout
/// service when that backend capability is available (ADR-014 §6).
class WalkModeStoreMap {
  const WalkModeStoreMap({
    required this.storeId,
    required this.layoutVersion,
    required this.aisles,
    this.sections = const [],
    this.storeWidth = 34,
    this.storeDepth = 42,
  });

  final String storeId;
  final String layoutVersion;
  final List<WalkModeAisle> aisles;
  final List<WalkModeStoreSection> sections;
  final double storeWidth;
  final double storeDepth;
}

enum WalkModeStoreSectionKind {
  produce,
  bakery,
  deli,
  meat,
  dairy,
  frozen,
  beverages,
  service,
  checkout,
  entrance,
  other,
}

/// A physical department/fixture zone in the store layout.
class WalkModeStoreSection {
  const WalkModeStoreSection({
    required this.id,
    required this.name,
    required this.kind,
    required this.x,
    required this.z,
    required this.width,
    required this.depth,
  });

  final String id;
  final String name;
  final WalkModeStoreSectionKind kind;
  final double x;
  final double z;
  final double width;
  final double depth;
}

class WalkModeAisle {
  const WalkModeAisle({
    required this.id,
    required this.name,
    required this.products,
    this.x = 0,
    this.z = 0,
    this.length = 24,
  });

  final String id;
  final String name;
  final List<WalkModeProductPlacement> products;

  /// World-space centre line supplied by the store layout contract.
  final double x;
  final double z;
  final double length;
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
