import 'package:flutter/foundation.dart';

import '../../../core/capabilities/basket_capability.dart';

/// The three Walk Mode interaction authorities defined by ADR-014.
enum WalkModeType { manual, aiAssisted, autopilot }

/// Walk Mode's first application boundary.
///
/// This controller deliberately owns only Walk Mode context and authority.
/// Basket state remains owned by the shared BasketCapability.
class WalkModeController extends ChangeNotifier {
  WalkModeController(this.basketCapability);

  final BasketCapability basketCapability;

  WalkModeType mode = WalkModeType.manual;
  String? currentDestination;

  int get basketItemCount => basketCapability.itemCount;

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

  Future<void> addToBasket(String productId, {int quantity = 1}) {
    return basketCapability.add(productId, quantity);
  }

  Future<void> removeFromBasket(String productId) {
    return basketCapability.remove(productId);
  }
}
