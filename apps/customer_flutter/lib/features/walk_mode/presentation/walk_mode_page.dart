import 'package:flutter/material.dart';

import 'walk_mode_controller.dart';

class WalkModePage extends StatelessWidget {
  const WalkModePage({super.key, required this.controller});

  final WalkModeController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([controller, controller.basketCapability]),
      builder: (context, _) {
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
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Walk Mode is connected to your shared basket. Spatial navigation and product-location intelligence will be added on this boundary.',
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
