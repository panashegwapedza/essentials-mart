import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';

/// Directional controls for the current spatial context.
///
/// Movement is intentionally delegated to the Walk Mode controller by the
/// parent. This widget only expresses customer movement intent.
class WalkModeSpatialControls extends StatelessWidget {
  const WalkModeSpatialControls({
    super.key,
    required this.position,
    required this.onMove,
    this.step = 1,
  });

  final WalkModeSpatialPosition position;
  final ValueChanged<WalkModeSpatialPosition> onMove;
  final double step;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        IconButton.filledTonal(
          tooltip: 'Move forward',
          onPressed: () => _move(0, step),
          icon: const Icon(Icons.keyboard_arrow_up),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton.filledTonal(
              tooltip: 'Move left',
              onPressed: () => _move(-step, 0),
              icon: const Icon(Icons.keyboard_arrow_left),
            ),
            const SizedBox(width: 8),
            IconButton.filledTonal(
              tooltip: 'Move backward',
              onPressed: () => _move(0, -step),
              icon: const Icon(Icons.keyboard_arrow_down),
            ),
            const SizedBox(width: 8),
            IconButton.filledTonal(
              tooltip: 'Move right',
              onPressed: () => _move(step, 0),
              icon: const Icon(Icons.keyboard_arrow_right),
            ),
          ],
        ),
      ],
    );
  }

  void _move(double dx, double dy) {
    onMove(
      WalkModeSpatialPosition(
        x: position.x + dx,
        y: position.y + dy,
        z: position.z,
      ),
    );
  }
}
