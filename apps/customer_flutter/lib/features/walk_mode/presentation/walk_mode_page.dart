import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';
import 'walk_mode_controller.dart';

class WalkModePage extends StatelessWidget {
  const WalkModePage({super.key, required this.controller});

  final WalkModeController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([controller, controller.basketCapability]),
      builder: (context, _) {
        final storeMap = controller.storeMap;
        return Scaffold(
          appBar: AppBar(
            title: const Text('Walk Mode'),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(
                  child: Text('Basket: ${controller.basketItemCount}'),
                ),
              ),
            ],
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const Text(
                'Living Digital Supermarket',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Browse the store spatially to discover products that search may never surface.',
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<WalkModeType>(
                initialValue: controller.mode,
                decoration: const InputDecoration(labelText: 'Walk Mode type'),
                items: WalkModeType.values
                    .map(
                      (mode) => DropdownMenuItem(
                        value: mode,
                        child: Text(_modeLabel(mode)),
                      ),
                    )
                    .toList(growable: false),
                onChanged: (mode) {
                  if (mode != null) controller.setMode(mode);
                },
              ),
              const SizedBox(height: 16),
              if (storeMap == null)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Text(
                      'Store spatial data is not loaded yet. Walk Mode will consume the authoritative store layout when available.',
                    ),
                  ),
                )
              else ...[
                Text(
                  'Store ${storeMap.storeId} · layout ${storeMap.layoutVersion}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                ...storeMap.aisles.map(
                  (aisle) => Card(
                    child: ListTile(
                      title: Text(aisle.name),
                      subtitle: Text('${aisle.products.length} products'),
                      trailing: const Icon(Icons.chevron_right),
                      selected: controller.currentAisleId == aisle.id,
                      onTap: () => controller.enterAisle(aisle.id),
                    ),
                  ),
                ),
                if (controller.currentAisle != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    controller.currentAisle!.name,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  ...controller.currentAisle!.products.map(
                    (placement) => _ProductDiscoveryCard(
                      placement: placement,
                      onAdd: placement.product.available
                          ? () => controller.addToBasket(placement.product.id)
                          : null,
                    ),
                  ),
                ],
              ],
              const SizedBox(height: 16),
              Text(
                'Current destination: ${controller.currentDestination ?? 'Not selected'}',
              ),
              const SizedBox(height: 8),
              OutlinedButton(
                onPressed: () => controller.setDestination('Store entrance'),
                child: const Text('Set destination'),
              ),
            ],
          ),
        );
      },
    );
  }

  static String _modeLabel(WalkModeType mode) {
    switch (mode) {
      case WalkModeType.manual:
        return 'Manual';
      case WalkModeType.aiAssisted:
        return 'AI Assisted';
      case WalkModeType.autopilot:
        return 'Autopilot';
    }
  }
}

class _ProductDiscoveryCard extends StatelessWidget {
  const _ProductDiscoveryCard({required this.placement, this.onAdd});

  final WalkModeProductPlacement placement;
  final VoidCallback? onAdd;

  @override
  Widget build(BuildContext context) {
    final product = placement.product;
    final asset = placement.asset;
    return Card(
      child: ListTile(
        title: Text(product.name),
        subtitle: Text(
          '${product.currency} ${(product.amountMinor / 100).toStringAsFixed(2)} · '
          '${product.available ? 'Available' : 'Unavailable'}\n'
          'Asset: ${asset.assetId} · fidelity: ${asset.fidelity.name}\n'
          '3D: ${asset.model3dUri ?? 'Not available'}\n'
          'AR: ${asset.arAssetUri ?? 'Not available'}',
        ),
        isThreeLine: true,
        trailing: onAdd == null
            ? const Icon(Icons.remove_shopping_cart_outlined)
            : IconButton(
                tooltip: 'Add to basket',
                onPressed: onAdd,
                icon: const Icon(Icons.add_shopping_cart),
              ),
      ),
    );
  }
}
