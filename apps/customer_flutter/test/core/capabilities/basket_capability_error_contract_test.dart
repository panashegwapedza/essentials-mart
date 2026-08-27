import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/core/errors/api_exception.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';

void main() {
  test('exposes the clean ApiException message', () async {
    const message = 'Unable to load basket';
    final capability = BasketCapability(const _ThrowingBasketRepository(
      ApiException(
        code: 'BASKET_LOAD_FAILED',
        message: message,
        statusCode: 503,
      ),
    ));

    await expectLater(capability.load(), throwsA(isA<ApiException>()));

    expect(capability.errorMessage, message);
  });
}

class _ThrowingBasketRepository implements BasketRepository {
  const _ThrowingBasketRepository(this.error);

  final ApiException error;

  @override
  Future<Basket> getBasket() async => throw error;

  @override
  Future<Basket> addToBasket(String productId, int quantity) async =>
      throw error;

  @override
  Future<Basket> removeFromBasket(String productId) async => throw error;
}
