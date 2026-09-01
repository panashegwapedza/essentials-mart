import 'dart:async';

import 'package:flutter/material.dart';

import '../../../core/widgets/shared_basket_sheet.dart';
import '../data/walk_mode_models.dart';
import 'walk_mode_controller.dart';
import 'walk_mode_spatial_controls.dart';
import 'walk_mode_spatial_view.dart';

/// Walk Mode is a bounded shopping session, not a map screen.
class WalkModePage extends StatefulWidget {
  const WalkModePage({super.key, required this.controller});

  final WalkModeController controller;

  @override
  State<WalkModePage> createState() => _WalkModePageState();
}

class _WalkModePageState extends State<WalkModePage> {
  Timer? _autopilotTimer;

  WalkModeController get controller => widget.controller;

  @override
  void initState() {
    super.initState();
    controller.addListener(_syncAutopilot);
  }

  @override
  void dispose() {
    _stopAutopilot();
    controller.removeListener(_syncAutopilot);
    controller.clearAisle();
    super.dispose();
  }

  void _syncAutopilot() {
    if (controller.mode == WalkModeType.autopilot &&
        controller.currentPosition != null &&
        !controller.isPaused) {
      _startAutopilot();
    } else {
      _stopAutopilot();
    }
  }

  void _startAutopilot() {
    if (_autopilotTimer != null) return;
    _autopilotTimer = Timer.periodic(const Duration(milliseconds: 650), (_) {
      final aisle = controller.currentAisle;
      final position = controller.currentPosition;
      if (aisle == null || position == null || controller.isPaused) return;

      // Autopilot owns movement only. Basket decisions remain explicit.
      // Positive Y is forward travel through the aisle in the spatial contract.
      controller.moveBy(dy: 0.45);

      final next = controller.nextAisle;
      if (next != null && controller.currentPosition!.y >= 6.0) {
        controller.enterAisle(next.id);
        controller.setSpatialPosition(
          const WalkModeSpatialPosition(x: 0, y: 0),
        );
      }
    });
  }

  void _stopAutopilot() {
    _autopilotTimer?.cancel();
    _autopilotTimer = null;
  }

  void _beginAisle(String aisleId) {
    controller.enterAisle(aisleId);
    controller.setSpatialPosition(const WalkModeSpatialPosition(x: 0, y: 0));
  }

  String _assistantMessage() {
    final visible = controller.visibleProducts;
    if (visible.isNotEmpty) {
      final names = visible.take(2).map((p) => p.product.name).join(' and ');
      return controller.mode == WalkModeType.aiAssisted
          ? 'I can see $names nearby. You decide what comes into the basket.'
          : 'Nearby: $names. Explore the aisle and discover what you want.';
    }
    final next = controller.nextAisle;
    if (next != null) {
      return 'Nothing nearby yet. The next useful area is ${next.name}.';
    }
    return 'You are exploring ${controller.currentAisle?.name ?? 'the store'}.';
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([controller, controller.basketCapability]),
      builder: (context, _) {
        final storeMap = controller.storeMap;
        final aisle = controller.currentAisle;
        final position = controller.currentPosition;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Walk Mode'),
            actions: [
              Badge(
                isLabelVisible: controller.basketItemCount > 0,
                label: Text('${controller.basketItemCount}'),
                child: IconButton(
                  tooltip: 'Shared basket',
                  onPressed: () => SharedBasketSheet.show(
                    context,
                    capability: controller.basketCapability,
                  ),
                  icon: const Icon(Icons.shopping_basket_outlined),
                ),
              ),
              const SizedBox(width: 8),
            ],
          ),
          body: storeMap == null
              ? const Center(
                  child: Text('Store spatial data is not loaded yet.'),
                )
              : ListView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Living Digital Supermarket',
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        Chip(label: Text('Store ${storeMap.storeId}')),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Walk the digital store to make products visible that search may never surface. The AI can assist, but you retain the decision.',
                    ),
                    const SizedBox(height: 16),
                    _ModeSelector(
                      value: controller.mode,
                      onChanged: controller.setMode,
                    ),
                    const SizedBox(height: 16),
                    if (aisle == null) ...[
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Where do you want to start?',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Choose a real store area. This is an entry point, not the Walk Mode itself.',
                              ),
                              const SizedBox(height: 14),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: storeMap.aisles
                                    .map(
                                      (item) => ActionChip(
                                        avatar: const Icon(
                                          Icons.category_outlined,
                                          size: 18,
                                        ),
                                        label: Text(item.name),
                                        onPressed: () => _beginAisle(item.id),
                                      ),
                                    )
                                    .toList(growable: false),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ] else if (position != null) ...[
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              '${aisle.name}  ·  ${controller.currentAisleIndex! + 1}/${storeMap.aisles.length}',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ),
                          Text(
                            '${(controller.journeyProgress * 100).round()}% journey',
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(value: controller.journeyProgress),
                      const SizedBox(height: 12),
                      WalkModeSpatialView(
                        aisle: aisle,
                        customerPosition: position,
                        visibleProducts: controller.visibleProducts,
                        headingDegrees: controller.headingDegrees,
                        onLook: controller.rotateView,
                        onProductTap: (placement) {
                          if (placement.product.available) {
                            controller.addToBasket(placement.product.id);
                          }
                        },
                      ),
                      const SizedBox(height: 12),
                      Card(
                        child: ListTile(
                          leading: Icon(
                            controller.mode == WalkModeType.aiAssisted
                                ? Icons.auto_awesome
                                : Icons.assistant_outlined,
                          ),
                          title: Text(
                            controller.mode == WalkModeType.autopilot
                                ? 'Autopilot is moving you through the route'
                                : 'Walk Mode assistant',
                          ),
                          subtitle: Text(_assistantMessage()),
                        ),
                      ),
                      const SizedBox(height: 12),
                      WalkModeSpatialControls(
                        position: position,
                        isPaused: controller.isPaused,
                        onMove: controller.setSpatialPosition,
                        onLook: controller.rotateView,
                        onPause: controller.togglePause,
                        onRecenter: controller.recenterView,
                        onInteract: controller.visibleProducts.isEmpty
                            ? null
                            : () => controller.addToBasket(
                                  controller.visibleProducts.first.product.id,
                                ),
                      ),
                      const SizedBox(height: 16),
                      if (controller.visibleProducts.isNotEmpty) ...[
                        Text(
                          'Products in your current context',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        ...controller.visibleProducts.map(
                          (placement) => _ProductCard(
                            placement: placement,
                            onAdd: placement.product.available
                                ? () => controller.addToBasket(
                                      placement.product.id,
                                    )
                                : null,
                          ),
                        ),
                      ],
                      const SizedBox(height: 8),
                      TextButton.icon(
                        onPressed: controller.nextAisle == null
                            ? null
                            : () => _beginAisle(controller.nextAisle!.id),
                        icon: const Icon(Icons.arrow_forward_rounded),
                        label: Text(
                          controller.nextAisle == null
                              ? 'Final aisle'
                              : 'Continue to ${controller.nextAisle!.name}',
                        ),
                      ),
                    ],
                  ],
                ),
        );
      },
    );
  }
}

class _ModeSelector extends StatelessWidget {
  const _ModeSelector({required this.value, required this.onChanged});

  final WalkModeType value;
  final ValueChanged<WalkModeType> onChanged;

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<WalkModeType>(
      segments: const [
        ButtonSegment(
          value: WalkModeType.manual,
          icon: Icon(Icons.pan_tool_outlined),
          label: Text('Manual'),
        ),
        ButtonSegment(
          value: WalkModeType.aiAssisted,
          icon: Icon(Icons.auto_awesome),
          label: Text('AI Assisted'),
        ),
        ButtonSegment(
          value: WalkModeType.autopilot,
          icon: Icon(Icons.navigation_rounded),
          label: Text('Autopilot'),
        ),
      ],
      selected: {value},
      onSelectionChanged: (selection) => onChanged(selection.first),
    );
  }
}

class _ProductCard extends StatelessWidget {
  const _ProductCard({required this.placement, this.onAdd});

  final WalkModeProductPlacement placement;
  final VoidCallback? onAdd;

  @override
  Widget build(BuildContext context) {
    final product = placement.product;
    return Card(
      child: ListTile(
        leading: const Icon(Icons.inventory_2_outlined),
        title: Text(product.name),
        subtitle: Text(
          '${product.currency} ${(product.amountMinor / 100).toStringAsFixed(2)} · '
          '${product.available ? 'Available' : 'Unavailable'}',
        ),
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
