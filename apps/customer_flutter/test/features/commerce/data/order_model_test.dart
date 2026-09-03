import 'package:flutter_test/flutter_test.dart';

import '../../../../lib/features/commerce/data/order_model.dart';

void main() {
  test('parses an order response', () {
    final order = Order.fromJson({
      'id': 'order-1',
      'status': 'placed',
      'total': {
        'amountMinor': 1250,
        'currency': 'USD',
      },
    });

    expect(order.id, 'order-1');
    expect(order.totalMinor, 1250);
    expect(order.currency, 'USD');
    expect(order.status, 'placed');
  });
}
