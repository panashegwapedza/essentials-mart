import 'package:flutter/material.dart';

import '../data/commerce_models.dart';
import 'commerce_controller.dart';

class BasketPage extends StatelessWidget {
  const BasketPage({super.key, required this.controller});

  final CommerceController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final basket = controller.basket;
        final lines = basket?.lines ?? const <BasketLine>[];
        final totalMinor = lines.fold<int>(
          0,
          (sum, line) => sum + line.amountMinor * line.quantity,
        );
        final currency = lines.isEmpty ? 'USD' : lines.first.currency;

        return Scaffold(
          appBar: AppBar(title: const Text('Basket')),
          body: lines.isEmpty
              ? const Center(child: Text('Your basket is empty.'))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    ...lines.map(
                      (line) {
                        final product = controller.products.where(
                          (item) => item.id == line.productId,
                        );
                        final name = product.isEmpty
                            ? 'Product ${line.productId}'
                            : product.first.name;
                        return Card(
                          child: ListTile(
                            title: Text(name),
                            subtitle: Text(
                              '${line.quantity} × ${(line.amountMinor / 100).toStringAsFixed(2)} $currency',
                            ),
                            trailing: IconButton(
                              tooltip: 'Remove item',
                              onPressed: controller.loading
                                  ? null
                                  : () => controller.remove(line.productId),
                              icon: const Icon(Icons.delete_outline),
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 12),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Total',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              '${(totalMinor / 100).toStringAsFixed(2)} $currency',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    FilledButton.icon(
                      onPressed: controller.loading
                          ? null
                          : () async {
                              final order = await controller.checkout();
                              if (!context.mounted || order == null) return;
                              await showDialog<void>(
                                context: context,
                                builder: (_) => AlertDialog(
                                  title: const Text('Order placed'),
                                  content: Text(
                                    'Order ${order.id} was placed successfully.',
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(context).pop(),
                                      child: const Text('Done'),
                                    ),
                                  ],
                                ),
                              );
                            },
                      icon: const Icon(Icons.check_circle_outline),
                      label: const Text('Place order'),
                    ),
                    if (controller.errorMessage != null) ...[
                      const SizedBox(height: 12),
                      Text(
                        controller.errorMessage!,
                        style: TextStyle(color: Theme.of(context).colorScheme.error),
                      ),
                    ],
                  ],
                ),
        );
      },
    );
  }
}
