import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';

/// A renderer-neutral model presented as a simple 2D store/aisle view.
///
/// This is intentionally not a fake 3D/AR renderer. It makes the spatial
/// contract visible to the customer while leaving richer renderers free to
/// consume the same positions later.
class WalkModeSpatialView extends StatelessWidget {
  const WalkModeSpatialView({
    super.key,
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
    this.onProductTap,
  });

  final WalkModeAisle aisle;
  final WalkModeSpatialPosition customerPosition;
  final List<WalkModeProductPlacement> visibleProducts;
  final ValueChanged<WalkModeProductPlacement>? onProductTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(aisle.name, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            const Text('Spatial view · products become visible as you move'),
            const SizedBox(height: 12),
            SizedBox(
              height: 280,
              width: double.infinity,
              child: CustomPaint(
                painter: _WalkModeSpatialPainter(
                  aisle: aisle,
                  customerPosition: customerPosition,
                  visibleProducts: visibleProducts,
                ),
                child: _SpatialTapLayer(
                  aisle: aisle,
                  customerPosition: customerPosition,
                  visibleProducts: visibleProducts,
                  onProductTap: onProductTap,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 4,
              children: [
                const _LegendItem(label: 'You', icon: Icons.person_pin_circle),
                const _LegendItem(label: 'Shelf', icon: Icons.shelves),
                _LegendItem(
                  label: '${visibleProducts.length} visible',
                  icon: Icons.visibility,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SpatialTapLayer extends StatelessWidget {
  const _SpatialTapLayer({
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
    this.onProductTap,
  });

  final WalkModeAisle aisle;
  final WalkModeSpatialPosition customerPosition;
  final List<WalkModeProductPlacement> visibleProducts;
  final ValueChanged<WalkModeProductPlacement>? onProductTap;

  @override
  Widget build(BuildContext context) {
    if (onProductTap == null) return const SizedBox.expand();

    return LayoutBuilder(
      builder: (context, constraints) {
        final transform = _SpatialTransform(constraints.biggest);
        return Stack(
          children: visibleProducts.map((placement) {
            final point = transform.toOffset(placement.position);
            return Positioned(
              left: point.dx - 20,
              top: point.dy - 20,
              width: 40,
              height: 40,
              child: Semantics(
                button: true,
                label: 'Discover ${placement.product.name}',
                child: GestureDetector(
                  onTap: () => onProductTap!(placement),
                  child: const Icon(Icons.touch_app_outlined, size: 28),
                ),
              ),
            );
          }).toList(growable: false),
        );
      },
    );
  }
}

class _WalkModeSpatialPainter extends CustomPainter {
  const _WalkModeSpatialPainter({
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
  });

  final WalkModeAisle aisle;
  final WalkModeSpatialPosition customerPosition;
  final List<WalkModeProductPlacement> visibleProducts;

  @override
  void paint(Canvas canvas, Size size) {
    final transform = _SpatialTransform(size);
    final border = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    final shelf = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.brown.withValues(alpha: 0.16);
    final visible = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.green;
    final customer = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.blue;

    final floor = RRect.fromRectAndRadius(
      Rect.fromLTWH(8, 8, size.width - 16, size.height - 16),
      const Radius.circular(16),
    );
    canvas.drawRRect(floor, border);

    for (final placement in aisle.products) {
      final point = transform.toOffset(placement.position);
      final shelfRect = Rect.fromCenter(
        center: point,
        width: 48,
        height: 28,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(shelfRect, const Radius.circular(6)),
        shelf,
      );
    }

    for (final placement in visibleProducts) {
      final point = transform.toOffset(placement.position);
      canvas.drawCircle(point, 7, visible);
    }

    final customerPoint = transform.toOffset(customerPosition);
    canvas.drawCircle(customerPoint, 11, customer);
    canvas.drawCircle(customerPoint, 16, border);

    final textPainter = TextPainter(
      text: const TextSpan(
        text: 'Spatial context',
        style: TextStyle(fontSize: 12),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    textPainter.paint(canvas, const Offset(16, 16));
  }

  @override
  bool shouldRepaint(covariant _WalkModeSpatialPainter oldDelegate) {
    return oldDelegate.aisle != aisle ||
        oldDelegate.customerPosition != customerPosition ||
        oldDelegate.visibleProducts != visibleProducts;
  }
}

class _SpatialTransform {
  const _SpatialTransform(this.size);

  final Size size;

  Offset toOffset(WalkModeSpatialPosition position) {
    const padding = 28.0;
    const worldScale = 38.0;
    final maxX = size.width - padding;
    final maxY = size.height - padding;
    return Offset(
      (padding + position.x * worldScale).clamp(padding, maxX),
      (size.height - padding - position.y * worldScale).clamp(padding, maxY),
    );
  }
}

class _LegendItem extends StatelessWidget {
  const _LegendItem({required this.label, required this.icon});

  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16),
        const SizedBox(width: 4),
        Text(label),
      ],
    );
  }
}
