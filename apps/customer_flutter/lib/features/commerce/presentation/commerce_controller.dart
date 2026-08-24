import 'package:flutter/foundation.dart';

import '../../../core/errors/api_exception.dart';
import '../data/commerce_models.dart';
import '../data/commerce_repository.dart';

class CommerceController extends ChangeNotifier {
  CommerceController(this._repository);

  final CommerceRepository _repository;

  List<Product> products = const [];
  Basket? basket;
  bool loading = false;
  String? errorMessage;

  Future<void> load() async {
    loading = true;
    errorMessage = null;
    notifyListeners();
    try {
      products = await _repository.listProducts();
      basket = await _repository.getBasket();
    } on ApiException catch (error) {
      errorMessage = error.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> add(Product product) async {
    if (!product.available) return;
    errorMessage = null;
    notifyListeners();
    try {
      basket = await _repository.addToBasket(product.id, 1);
    } on ApiException catch (error) {
      errorMessage = error.message;
      notifyListeners();
    }
  }

  Future<void> remove(String productId) async {
    errorMessage = null;
    notifyListeners();
    try {
      basket = await _repository.removeFromBasket(productId);
    } on ApiException catch (error) {
      errorMessage = error.message;
      notifyListeners();
    }
  }
}
