import 'package:flutter_test/flutter_test.dart';

import '../../../lib/core/capabilities/basket_capability.dart';
import '../../../lib/features/commerce/data/commerce_models.dart';
import '../../../lib/features/commerce/data/commerce_repository.dart';

class _FakeBasketRepository implements BasketRepository {
  Basket basket = const Basket(lines: []);

  @override
  Future<Basket> getBasket() async => basket;

  @override
  Future<Basket> addToBasket(String productId, int quantity) async {
    basket = Basket(lines: [
      BasketLine(productId: productId, quantity: quantity),
    ]);
    return basket;
  }

  @override
  Future<Basket> removeFromBasket(String productId) async {
    basket = const Basket(lines: []);
    return basket;
  }
}

void main() {
  test('itemCount reflects shared basket state', () async {
    final repository = _FakeBasketRepository();
    final capability = BasketCapability(repository);

    await capability.add('milk', 2);

    expect(capability.itemCount, 2);
  });

  test('load hydrates shared basket state', () async {
    final repository = _FakeBasketRepository();
    repository.basket = const Basket(
      lines: [
        BasketLine(productId: 'milk', quantity: 2),
        BasketLine(productId: 'bread', quantity: 1),
      ],
    );
    final capability = BasketCapability(repository);

    await capability.load();

    expect(capability.itemCount, 3);
  });
}
