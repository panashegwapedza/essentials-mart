import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';

void main() {
  test('product DTO maps only the public API contract', () {
    final product = Product.fromJson({
      'id': 'bread',
      'name': 'Bread [DEV FIXTURE]',
      'price': {'amountMinor': 250, 'currency': 'USD'},
      'available': true,
      'internalField': 'must not be consumed',
    });

    expect(product.id, 'bread');
    expect(product.name, 'Bread [DEV FIXTURE]');
    expect(product.amountMinor, 250);
    expect(product.currency, 'USD');
    expect(product.available, isTrue);
  });

  test('basket DTO preserves line quantity and price snapshot', () {
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

    expect(basket.id, 'basket-1');
    expect(basket.lines.single.quantity, 2);
    expect(basket.lines.single.amountMinor, 250);
  });
}
