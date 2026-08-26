import 'package:flutter/foundation.dart';

import '../../features/commerce/data/commerce_models.dart';
import '../../features/commerce/data/commerce_repository.dart';

/// Shared, server-authoritative basket capability.
///
/// Consumers such as Commerce and Walk Mode should depend on this capability
/// rather than maintaining their own basket state.
class BasketCapability extends ChangeNotifier {
  BasketCapability(this._repository);

  final BasketRepository _repository;

  Basket? basket;
  bool loading = false;
  String? errorMessage;

  int get itemCount =>
      basket?.lines.fold<int>(0, (sum, line) => sum + line.quantity) ?? 0;

  Future<void> load() async {
    loading = true;
    errorMessage = null;
    notifyListeners();
    try {
      basket = await _repository.getBasket();
    } catch (error) {
      errorMessage = error.toString();
      rethrow;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> add(String productId, int quantity) async {
    errorMessage = null;
    notifyListeners();
    try {
      basket = await _repository.addToBasket(productId, quantity);
    } catch (error) {
      errorMessage = error.toString();
      notifyListeners();
      rethrow;
    }
    notifyListeners();
  }

  Future<void> remove(String productId) async {
    errorMessage = null;
    notifyListeners();
    try {
      basket = await _repository.removeFromBasket(productId);
    } catch (error) {
      errorMessage = error.toString();
      notifyListeners();
      rethrow;
    }
    notifyListeners();
  }
}
