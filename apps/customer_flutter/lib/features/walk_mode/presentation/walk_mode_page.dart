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
      if (controller.currentPosition == null || controller.isPaused) return;

      controller.moveBy(dy: 0.32);

      final next = controller.nextAisle;
      if (next != null && controller.currentPosition!.y >= 6.0) {
        controller.enterAisle(next.id);
        controller.setSpatialPosition(const WalkModeSpatialPosition(x: 0, y: 0));
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
      if (controller.mode == WalkModeType.aiAssisted) {
        return 'I found $names in your current context. I can point things out; you decide what enters the basket.';
      }
      if (controller.mode == WalkModeType.autopilot) {
        return 'I am taking you through the store. You remain in control of every basket decision.';
      }
      return '$names are in view. Keep walking to discover more products around you.';
    }
    return 'Keep exploring. Walk Mode surfaces products because you are moving through the store, not because you searched for them.';
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
          backgroundColor: Theme.of(context).colorScheme.surface,
          appBar: AppBar(
            titleSpacing: 16,
            title: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Walk Mode'),
                Text('Living Digital Supermarket', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w400)),
              ],
            ),
            actions: [
              Badge(
                isLabelVisible: controller.basketItemCount > 0,
                label: Text('${controller.basketItemCount}'),
                child: IconButton(
                  tooltip: 'Shared basket',
                  onPressed: () => SharedBasketSheet.show(context, capability: controller.basketCapability),
                  icon: const Icon(Icons.shopping_basket_outlined),
                ),
              ),
              const SizedBox(width: 8),
            ],
          ),
          body: storeMap == null
              ? const Center(child: Text('Store spatial data is not loaded yet.'))
              : aisle == null || position == null
                  ? _AisleEntry(aisles: storeMap.aisles, onSelect: _beginAisle)
                  : SafeArea(
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        aisle.name,
                                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${controller.currentAisleIndex! + 1} of ${storeMap.aisles.length} · ${(controller.journeyProgress * 100).round()}% journey',
                                        style: Theme.of(context).textTheme.bodySmall,
                                      ),
                                    ],
                                  ),
                                ),
                                _ModeSelector(value: controller.mode, onChanged: controller.setMode),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: LinearProgressIndicator(value: controller.journeyProgress, minHeight: 3),
                          ),
                          const SizedBox(height: 10),
                          Expanded(
                            child: SingleChildScrollView(
                              padding: const EdgeInsets.fromLTRB(12, 0, 12, 18),
                              child: Column(
                                children: [
                                  SizedBox(
                                    height: 540,
                                    child: WalkModeSpatialView(
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
                                  ),
                                  const SizedBox(height: 10),
                                  Card(
                                    margin: EdgeInsets.zero,
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                      child: Row(
                                        children: [
                                          Icon(
                                            controller.mode == WalkModeType.aiAssisted
                                                ? Icons.auto_awesome
                                                : controller.mode == WalkModeType.autopilot
                                                    ? Icons.navigation_rounded
                                                    : Icons.explore_rounded,
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(child: Text(_assistantMessage())),
                                        ],
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  WalkModeSpatialControls(
                                    position: position,
                                    mode: controller.mode,
                                    isPaused: controller.isPaused,
                                    onMove: controller.setSpatialPosition,
                                    onLook: controller.rotateView,
                                    onPause: controller.togglePause,
                                    onRecenter: controller.recenterView,
                                    onTakeControl: () => controller.setMode(WalkModeType.manual),
                                    onInteract: controller.visibleProducts.isEmpty
                                        ? null
                                        : () => controller.addToBasket(controller.visibleProducts.first.product.id),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: controller.nextAisle == null
                                              ? null
                                              : () => _beginAisle(controller.nextAisle!.id),
                                          icon: const Icon(Icons.storefront_rounded),
                                          label: Text(
                                            controller.nextAisle == null
                                                ? 'Journey complete'
                                                : 'Explore next area · ${controller.nextAisle!.name}',
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
        );
      },
    );
  }
}

class _AisleEntry extends StatelessWidget {
  const _AisleEntry({required this.aisles, required this.onSelect});

  final List<WalkModeAisle> aisles;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 620),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.storefront_rounded, size: 42),
                  const SizedBox(height: 18),
                  Text('Step inside', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  const Text('Walk Mode turns the supermarket into a place you can explore. Move through an area and let products become visible naturally.'),
                  const SizedBox(height: 22),
                  Text('Choose where to enter', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 10),
                  ...aisles.map(
                    (aisle) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: SizedBox(
                        width: double.infinity,
                        child: FilledButton.tonalIcon(
                          onPressed: () => onSelect(aisle.id),
                          icon: const Icon(Icons.login_rounded),
                          label: Align(alignment: Alignment.centerLeft, child: Text(aisle.name)),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ModeSelector extends StatelessWidget {
  const _ModeSelector({required this.value, required this.onChanged});

  final WalkModeType value;
  final ValueChanged<WalkModeType> onChanged;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<WalkModeType>(
      tooltip: 'Walk Mode control mode',
      onSelected: onChanged,
      itemBuilder: (context) => const [
        PopupMenuItem(value: WalkModeType.manual, child: Text('Manual')),
        PopupMenuItem(value: WalkModeType.aiAssisted, child: Text('AI Assisted')),
        PopupMenuItem(value: WalkModeType.autopilot, child: Text('Autopilot')),
      ],
      child: Chip(
        avatar: Icon(
          value == WalkModeType.manual
              ? Icons.pan_tool_outlined
              : value == WalkModeType.aiAssisted
                  ? Icons.auto_awesome
                  : Icons.navigation_rounded,
          size: 17,
        ),
        label: Text(
          value == WalkModeType.manual
              ? 'Manual'
              : value == WalkModeType.aiAssisted
                  ? 'AI Assisted'
                  : 'Autopilot',
        ),
      ),
    );
  }
}
