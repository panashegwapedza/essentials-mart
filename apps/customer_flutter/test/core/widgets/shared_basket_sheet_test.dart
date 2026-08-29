import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:essentials_mart_customer/core/capabilities/basket_capability.dart';
import 'package:essentials_mart_customer/core/widgets/shared_basket_sheet.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_models.dart';
import 'package:essentials_mart_customer/features/commerce/data/commerce_repository.dart';

void main() {
  testWidgets('renders the shared basket and delegates removal', (tester) async {
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
    final repository = _FakeBasketRepository(basket);
    final capability = BasketCapability(repository)..basket = basket;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) => FilledButton(
              onPressed: () => SharedBasketSheet.show(
                context,
                capability: capability,
              ),
              child: const Text('Open basket'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Open basket'));
    await tester.pumpAndSettle();

    expect(find.text('Shared basket'), findsOneWidget);
    expect(find.text('bread'), findsOneWidget);
    expect(find.text('2 × 2.5 USD'), findsOneWidget);
    expect(find.text('5.0 USD'), findsOneWidget);

    await tester.tap(find.byTooltip('Remove from basket'));
    await tester.pumpAndSettle();

    expect(repository.removedProductId, 'bread');
  });
}

class _FakeBasketRepository implements BasketRepository {
  _FakeBasketRepository(this.basket);

  final Basket basket;
  String? removedProductId;

  @override
  Future<Basket> getBasket() async => basket;

  @override
  Future<Basket> addToBasket(String productId, int quantity) async => basket;

  @override
  Future<Basket> removeFromBasket(String productId) async {
    removedProductId = productId;
    return Basket.fromJson({'id': basket.id, 'lines': []});
  }
}
