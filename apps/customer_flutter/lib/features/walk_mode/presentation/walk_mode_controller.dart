import 'package:flutter/foundation.dart';

import '../../../core/capabilities/basket_capability.dart';
import '../data/walk_mode_models.dart';
import '../data/walk_mode_spatial_discovery.dart';

/// The three Walk Mode interaction authorities defined by ADR-014.
enum WalkModeType { manual, aiAssisted, autopilot }

/// Walk Mode's application boundary.
///
/// This controller owns Walk Mode context and authority while the shared
/// BasketCapability remains the single owner of basket state.
class WalkModeController extends ChangeNotifier {
  WalkModeController(
    this.basketCapability, {
    this.storeMap,
    WalkModeSpatialDiscovery? spatialDiscovery,
  }) : _spatialDiscovery = spatialDiscovery ?? const WalkModeSpatialDiscovery();

  final BasketCapability basketCapability;
  WalkModeStoreMap? storeMap;
  final WalkModeSpatialDiscovery _spatialDiscovery;

  WalkModeType mode = WalkModeType.manual;
  String? currentDestination;
  String? currentAisleId;
  WalkModeSpatialPosition? currentPosition;
  final Set<String> _encounteredProductIds = <String>{};

  int get basketItemCount => basketCapability.itemCount;
  Set<String> get encounteredProductIds => Set.unmodifiable(_encounteredProductIds);

  WalkModeAisle? get currentAisle {
    final id = currentAisleId;
    final map = storeMap;
    if (id == null || map == null) return null;
    for (final aisle in map.aisles) {
      if (aisle.id == id) return aisle;
    }
    return null;
  }

  List<WalkModeProductPlacement> get visibleProducts {
    final aisle = currentAisle;
    final position = currentPosition;
    if (aisle == null || position == null) return const [];
    return _spatialDiscovery.discover(
      aisle: aisle,
      customerPosition: position,
    );
  }

  void setStoreMap(WalkModeStoreMap value) {
    storeMap = value;
    currentAisleId = null;
    currentPosition = null;
    _encounteredProductIds.clear();
    notifyListeners();
  }

  void setMode(WalkModeType value) {
    if (mode == value) return;
    mode = value;
    notifyListeners();
  }

  void setDestination(String? destination) {
    if (currentDestination == destination) return;
    currentDestination = destination;
    notifyListeners();
  }

  void enterAisle(String aisleId) {
    if (currentAisleId == aisleId) return;
    currentAisleId = aisleId;
    currentPosition = null;
    _encounteredProductIds.clear();
    notifyListeners();
  }

  void setSpatialPosition(WalkModeSpatialPosition position) {
    if (currentPosition == position) return;
    currentPosition = position;
    _recordCurrentEncounters();
    notifyListeners();
  }

  /// Applies a customer movement intent to the current spatial position.
  ///
  /// Movement is deliberately a controller concern; presentation widgets
  /// emit intent while this boundary owns the resulting Walk Mode state.
  void moveBy({double dx = 0, double dy = 0, double dz = 0}) {
    final position = currentPosition;
    if (position == null) return;
    setSpatialPosition(
      WalkModeSpatialPosition(
        x: position.x + dx,
        y: position.y + dy,
        z: position.z + dz,
      ),
    );
  }

  void _recordCurrentEncounters() {
    for (final placement in visibleProducts) {
      _encounteredProductIds.add(placement.product.id);
    }
  }

  void clearAisle() {
    if (currentAisleId == null && currentPosition == null) return;
    currentAisleId = null;
    currentPosition = null;
    _encounteredProductIds.clear();
    notifyListeners();
  }

  Future<void> addToBasket(String productId, {int quantity = 1}) {
    return basketCapability.add(productId, quantity);
  }

  Future<void> removeFromBasket(String productId) {
    return basketCapability.remove(productId);
  }
}
