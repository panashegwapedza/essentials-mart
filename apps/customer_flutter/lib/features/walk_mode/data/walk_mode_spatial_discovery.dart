import 'walk_mode_models.dart';

/// Renderer-neutral spatial discovery calculation for Walk Mode.
///
/// Discovery is based on the customer's spatial context, not on AI
/// recommendation. Products are returned in deterministic nearest-first order
/// so presentation layers can surface what the customer has encountered.
class WalkModeSpatialDiscovery {
  const WalkModeSpatialDiscovery({this.visibilityRadius = 3.0})
      : assert(visibilityRadius >= 0);

  final double visibilityRadius;

  List<WalkModeProductPlacement> discover({
    required WalkModeAisle aisle,
    required WalkModeSpatialPosition customerPosition,
  }) {
    final radiusSquared = visibilityRadius * visibilityRadius;
    final visible = aisle.products
        .where(
          (placement) =>
              _distanceSquared(customerPosition, placement.position) <=
              radiusSquared,
        )
        .toList(growable: false);

    final ordered = [...visible];
    ordered.sort((a, b) {
      final distance = _distanceSquared(customerPosition, a.position)
          .compareTo(_distanceSquared(customerPosition, b.position));
      if (distance != 0) return distance;
      return a.product.id.compareTo(b.product.id);
    });
    return ordered;
  }

  static double _distanceSquared(
    WalkModeSpatialPosition first,
    WalkModeSpatialPosition second,
  ) {
    final dx = first.x - second.x;
    final dy = first.y - second.y;
    final dz = first.z - second.z;
    return dx * dx + dy * dy + dz * dz;
  }
}
