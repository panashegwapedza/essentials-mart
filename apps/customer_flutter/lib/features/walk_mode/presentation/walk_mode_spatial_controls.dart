import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';
import 'walk_mode_controller.dart';

/// Immersive Walk Mode control surface.
///
/// This is intentionally not a four-arrow map controller. Movement is a
/// continuous thumb-stick gesture, looking is a separate touch surface, and
/// the action rail exposes the interaction primitives needed by Manual,
/// AI Assisted and Autopilot modes.
class WalkModeSpatialControls extends StatelessWidget {
  const WalkModeSpatialControls({
    super.key,
    required this.position,
    required this.mode,
    required this.onMove,
    this.onLook,
    this.onInteract,
    this.onPause,
    this.onRecenter,
    this.onTakeControl,
    this.isPaused = false,
    this.step = 0.42,
  });

  final WalkModeSpatialPosition position;
  final WalkModeType mode;
  final ValueChanged<WalkModeSpatialPosition> onMove;
  final ValueChanged<double>? onLook;
  final VoidCallback? onInteract;
  final VoidCallback? onPause;
  final VoidCallback? onRecenter;
  final VoidCallback? onTakeControl;
  final bool isPaused;
  final double step;

  @override
  Widget build(BuildContext context) {
    final autopilot = mode == WalkModeType.autopilot;

    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _ActionButton(icon: Icons.explore_rounded, label: 'Recenter', onPressed: onRecenter)),
            const SizedBox(width: 8),
            Expanded(child: _ActionButton(
              icon: isPaused ? Icons.play_arrow_rounded : Icons.pause_rounded,
              label: isPaused ? 'Resume' : 'Pause',
              onPressed: onPause,
            )),
            const SizedBox(width: 8),
            Expanded(child: _ActionButton(
              icon: Icons.touch_app_rounded,
              label: 'Inspect',
              onPressed: onInteract,
              emphasized: true,
            )),
            if (autopilot) ...[
              const SizedBox(width: 8),
              Expanded(child: _ActionButton(
                icon: Icons.pan_tool_rounded,
                label: 'Take control',
                onPressed: onTakeControl,
                emphasized: true,
              )),
            ],
          ],
        ),
        const SizedBox(height: 14),
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _MovementPad(
              onMove: (dx, dy) => onMove(WalkModeSpatialPosition(
                x: position.x + dx * step,
                y: position.y + dy * step,
                z: position.z,
              )),
            ),
            const SizedBox(width: 14),
            Expanded(child: _LookPad(onLook: onLook)),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.swipe_rounded, size: 16, color: Theme.of(context).colorScheme.onSurfaceVariant),
            const SizedBox(width: 6),
            Text(
              'Drag to move · swipe to look · tap a product to inspect',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ],
    );
  }
}

class _MovementPad extends StatelessWidget {
  const _MovementPad({required this.onMove});
  final void Function(double dx, double dy) onMove;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Walk Mode movement control',
      hint: 'Drag the control in the direction you want to walk',
      child: GestureDetector(
        onPanUpdate: (details) {
          final dx = (details.delta.dx / 20).clamp(-1.0, 1.0).toDouble();
          final dy = (-details.delta.dy / 20).clamp(-1.0, 1.0).toDouble();
          onMove(dx, dy);
        },
        child: Container(
          width: 126,
          height: 126,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Theme.of(context).colorScheme.outline.withValues(alpha: .55), width: 2),
          ),
          child: Center(
            child: Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                boxShadow: const [BoxShadow(blurRadius: 10)],
              ),
              child: const Icon(Icons.gamepad_rounded),
            ),
          ),
        ),
      ),
    );
  }
}

class _LookPad extends StatelessWidget {
  const _LookPad({this.onLook});
  final ValueChanged<double>? onLook;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Walk Mode look control',
      hint: 'Swipe horizontally to turn your view',
      child: GestureDetector(
        onPanUpdate: onLook == null ? null : (details) => onLook!(details.delta.dx * 0.7),
        child: Container(
          height: 126,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Theme.of(context).colorScheme.outline.withValues(alpha: .45)),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: .35),
                Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: .72),
              ],
            ),
          ),
          child: const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.threesixty_rounded, size: 30),
                SizedBox(height: 5),
                Text('LOOK AROUND', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.1)),
                SizedBox(height: 3),
                Text('Swipe', style: TextStyle(fontSize: 11)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({required this.icon, required this.label, required this.onPressed, this.emphasized = false});
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
        child: FilledButton.tonalIcon(
          onPressed: onPressed,
          icon: Icon(icon, size: 18),
          label: Text(label, overflow: TextOverflow.ellipsis),
          style: FilledButton.styleFrom(
            minimumSize: const Size(0, 48),
            padding: const EdgeInsets.symmetric(horizontal: 10),
            visualDensity: VisualDensity.compact,
            backgroundColor: emphasized ? Theme.of(context).colorScheme.primaryContainer : null,
          ),
        ),
      ),
    );
  }
}
