import 'package:flutter/foundation.dart';

import '../../../core/capabilities/basket_capability.dart';
import '../data/walk_mode_models.dart';

/// The three Walk Mode interaction authorities defined by ADR-014.
enum WalkModeType { manual, aiAssisted, autopilot }

/// Walk Mode's application boundary.
///
/// This controller owns Walk Mode context and authority while the shared
/// BasketCapability remains the single owner of basket state.
class WalkModeController extends ChangeNotifier {
  WalkModeController(this.basketCapability, {WalkModeStoreMap? storeMap})
      : storeMap = storeMap;

  final BasketCapability basketCapability;
  final WalkModeStoreMap? storeMap;

  WalkModeType mode = WalkModeType.manual;
  String? currentDestination;
  String? currentAisleId;

  int get basketItemCount => basketCapability.itemCount;

  WalkModeAisle? get currentAisle {
    final id = currentAisleId;
    if (id == null || storeMap == null) return null;
    for (final aisle in storeMap!.aisles) {
      if (aisle.id == id) return aisle;
    }
    return null;
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
    notifyListeners();
  }

  void clearAisle() {
    if (currentAisleId == null) return;
    currentAisleId = null;
    notifyListeners();
  }

  Future<void> addToBasket(String productId, {int quantity = 1}) {
    return basketCapability.add(productId, quantity);
  }

  Future<void> removeFromBasket(String productId) {
    return basketCapability.remove(productId);
  }
}
