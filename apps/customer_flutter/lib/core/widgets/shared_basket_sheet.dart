import 'package:flutter/material.dart';

import '../capabilities/basket_capability.dart';

/// Shared basket presentation used by Commerce and Walk Mode.
///
/// The widget deliberately delegates all basket mutations to the shared,
/// server-authoritative BasketCapability.
class SharedBasketSheet extends StatelessWidget {
  const SharedBasketSheet({super.key, required this.capability});

  final BasketCapability capability;

  static Future<void> show(
    BuildContext context, {
    required BasketCapability capability,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => SharedBasketSheet(capability: capability),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: capability,
      builder: (context, _) {
        final basket = capability.basket;
        final lines = basket?.lines ?? const [];
        final totalMinor = lines.fold<int>(
          0,
          (sum, line) => sum + (line.amountMinor * line.quantity),
        );
        final currency = lines.isEmpty ? '' : lines.first.currency;

        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Shared basket',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Text('${capability.itemCount} items'),
                  ],
                ),
                const SizedBox(height: 12),
                if (capability.errorMessage != null)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(capability.errorMessage!),
                    ),
                  ),
                if (capability.loading && basket == null)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 32),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (lines.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 32),
                    child: Center(child: Text('Your basket is empty.')),
                  )
                else ...[
                  Flexible(
                    child: ListView.separated(
                      shrinkWrap: true,
                      itemCount: lines.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final line = lines[index];
                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(line.productId),
                          subtitle: Text(
                            '${line.quantity} × '
                            '${line.amountMinor / 100} ${line.currency}',
                          ),
                          trailing: IconButton(
                            tooltip: 'Remove from basket',
                            onPressed: capability.loading
                                ? null
                                : () => capability.remove(line.productId),
                            icon: const Icon(Icons.delete_outline),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Total',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                      Text(
                        '${totalMinor / 100} $currency',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
