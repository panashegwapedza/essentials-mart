import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';

/// Customer-facing Walk Mode controls.
///
/// Walk Mode is not a four-arrow map. The control surface deliberately
/// separates movement, looking, product interaction, pause/takeover and
/// recentering so the experience can grow into AI Assisted and Autopilot
/// without changing the spatial contract.
class WalkModeSpatialControls extends StatelessWidget {
  const WalkModeSpatialControls({
    super.key,
    required this.position,
    required this.onMove,
    this.onLook,
    this.onInteract,
    this.onPause,
    this.onRecenter,
    this.isPaused = false,
    this.step = 0.6,
  });

  final WalkModeSpatialPosition position;
  final ValueChanged<WalkModeSpatialPosition> onMove;
  final ValueChanged<double>? onLook;
  final VoidCallback? onInteract;
  final VoidCallback? onPause;
  final VoidCallback? onRecenter;
  final bool isPaused;
  final double step;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _ControlButton(
              icon: Icons.refresh_rounded,
              label: 'Recenter',
              onPressed: onRecenter,
            ),
            const SizedBox(width: 12),
            _ControlButton(
              icon: isPaused ? Icons.play_arrow_rounded : Icons.pause_rounded,
              label: isPaused ? 'Resume' : 'Pause',
              onPressed: onPause,
              emphasized: true,
            ),
            const SizedBox(width: 12),
            _ControlButton(
              icon: Icons.touch_app_rounded,
              label: 'Interact',
              onPressed: onInteract,
              emphasized: true,
            ),
          ],
        ),
        const SizedBox(height: 14),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: _Joystick(
                onMove: (dx, dy) => onMove(
                  WalkModeSpatialPosition(
                    x: position.x + dx * step,
                    y: position.y + dy * step,
                    z: position.z,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 20),
            Column(
              children: [
                _ControlButton(
                  icon: Icons.rotate_left_rounded,
                  label: 'Look left',
                  onPressed: onLook == null ? null : () => onLook!(-1),
                ),
                const SizedBox(height: 8),
                _ControlButton(
                  icon: Icons.rotate_right_rounded,
                  label: 'Look right',
                  onPressed: onLook == null ? null : () => onLook!(1),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 8),
        const Text(
          'Move freely · look around · interact with products · pause and take over',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}

class _Joystick extends StatelessWidget {
  const _Joystick({required this.onMove});

  final void Function(double dx, double dy) onMove;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: GestureDetector(
        onPanUpdate: (details) {
          final dx = (details.delta.dx / 18).clamp(-1.0, 1.0);
          final dy = (-details.delta.dy / 18).clamp(-1.0, 1.0);
          onMove(dx, dy);
        },
        child: Semantics(
          label: 'Walk Mode movement joystick',
          hint: 'Drag to move through the store',
          child: Container(
            width: 112,
            height: 112,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(width: 2),
            ),
            child: Center(
              child: Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                ),
                child: const Icon(Icons.gamepad_rounded),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ControlButton extends StatelessWidget {
  const _ControlButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.emphasized = false,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final bool emphasized;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: Tooltip(
        message: label,
        child: IconButton.filledTonal(
          onPressed: onPressed,
          icon: Icon(icon),
          style: emphasized
              ? IconButton.styleFrom(
                  minimumSize: const Size(52, 52),
                  padding: const EdgeInsets.all(14),
                )
              : null,
        ),
      ),
    );
  }
}
