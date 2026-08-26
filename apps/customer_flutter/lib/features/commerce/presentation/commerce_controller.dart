import 'package:flutter/foundation.dart';

import '../../../core/capabilities/basket_capability.dart';
import '../../../core/errors/api_exception.dart';
import '../data/commerce_models.dart';
import '../data/commerce_repository.dart';

class CommerceController extends ChangeNotifier {
  CommerceController(this._repository, this.basketCapability);

  final CommerceRepository _repository;
  final BasketCapability basketCapability;

  List<Product> products = const [];
  bool loading = false;
  String? errorMessage;

  Future<void> load() async {
    loading = true;
    errorMessage = null;
    notifyListeners();
    try {
      products = await _repository.listProducts();
      await basketCapability.load();
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
      await basketCapability.add(product.id, 1);
    } on ApiException catch (error) {
      errorMessage = error.message;
      notifyListeners();
    }
  }

  Future<void> remove(String productId) async {
    errorMessage = null;
    notifyListeners();
    try {
      await basketCapability.remove(productId);
    } on ApiException catch (error) {
      errorMessage = error.message;
      notifyListeners();
    }
  }
}
