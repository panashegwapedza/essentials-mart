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

  int get basketItemCount => basketCapability.itemCount;

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
    notifyListeners();
  }

  void setSpatialPosition(WalkModeSpatialPosition position) {
    if (currentPosition == position) return;
    currentPosition = position;
    notifyListeners();
  }

  void clearAisle() {
    if (currentAisleId == null && currentPosition == null) return;
    currentAisleId = null;
    currentPosition = null;
    notifyListeners();
  }

  Future<void> addToBasket(String productId, {int quantity = 1}) {
    return basketCapability.add(productId, quantity);
  }

  Future<void> removeFromBasket(String productId) {
    return basketCapability.remove(productId);
  }
}
