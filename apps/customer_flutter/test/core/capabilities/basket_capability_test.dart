import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';

void main() {
  test('loads and exposes the server basket', () async {
    final basket = Basket.fromJson({
      'id': 'basket-1',
      'lines': [
        {
          'productId': 'bread',
          'quantity': 2,
          'unitPrice': {'amountMinor': 250, 'currency': 'USD'},
        },
      ],
    });
    final capability = BasketCapability(_FakeBasketRepository(basket));

    await capability.load();

    expect(capability.basket?.id, 'basket-1');
    expect(capability.basket?.lines.single.quantity, 2);
    expect(capability.loading, isFalse);
  });

  test('mutations replace local state with the server response', () async {
    final first = Basket.fromJson({'id': 'basket-1', 'lines': []});
    final updated = Basket.fromJson({
      'id': 'basket-1',
      'lines': [
        {
          'productId': 'bread',
          'quantity': 1,
          'unitPrice': {'amountMinor': 250, 'currency': 'USD'},
        },
      ],
    });
    final repository = _FakeBasketRepository(first, updatedBasket: updated);
    final capability = BasketCapability(repository);

    await capability.load();
    await capability.add('bread', 1);

    expect(capability.basket, same(updated));
  });
}

class _FakeBasketRepository implements BasketRepository {
  _FakeBasketRepository(this.basket, {this.updatedBasket});

  Basket basket;
  final Basket? updatedBasket;

  @override
  Future<Basket> getBasket() async => basket;

  @override
  Future<Basket> addToBasket(String productId, int quantity) async {
    return updatedBasket ?? basket;
  }

  @override
  Future<Basket> removeFromBasket(String productId) async => basket;
}
