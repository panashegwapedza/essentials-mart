import 'package:flutter/material.dart';

import '../data/commerce_models.dart';
import 'commerce_controller.dart';

class CommercePage extends StatelessWidget {
  const CommercePage({super.key, required this.controller});

  final CommerceController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final basketCount = controller.basket?.lines.fold<int>(0, (sum, line) => sum + line.quantity) ?? 0;
        return Scaffold(
          appBar: AppBar(
            title: const Text('Essentials Mart'),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(child: Text('Basket: $basketCount')),
              ),
            ],
          ),
          body: RefreshIndicator(
            onRefresh: controller.load,
            child: _body(context),
          ),
        );
      },
    );
  }

  Widget _body(BuildContext context) {
    if (controller.loading && controller.products.isEmpty) {
      return const ListView(children: [SizedBox(height: 300), Center(child: CircularProgressIndicator())]);
    }
    if (controller.errorMessage != null && controller.products.isEmpty) {
      return ListView(children: [
        const SizedBox(height: 220),
        Center(child: Text(controller.errorMessage!)),
        Center(child: TextButton(onPressed: controller.load, child: const Text('Retry'))),
      ]);
    }
    if (controller.products.isEmpty) {
      return const ListView(children: [SizedBox(height: 220), Center(child: Text('No products available.'))]);
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (controller.errorMessage != null)
          Card(child: Padding(padding: const EdgeInsets.all(12), child: Text(controller.errorMessage!))),
        const Text('Products', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...controller.products.map(_productTile),
      ],
    );
  }

  Widget _productTile(Product product) {
    return Card(
      child: ListTile(
        title: Text(product.name),
        subtitle: Text('${product.amountMinor / 100} ${product.currency}'),
        trailing: product.available
            ? FilledButton(onPressed: () => controller.add(product), child: const Text('Add'))
            : const Text('Unavailable'),
      ),
    );
  }
}
