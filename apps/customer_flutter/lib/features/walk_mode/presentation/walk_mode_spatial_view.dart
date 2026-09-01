import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../data/walk_mode_models.dart';

/// Immersive Walk Mode viewport.
///
/// This is a perspective/first-person presentation rather than a top-down
/// map. The spatial contract remains renderer-neutral so a true 3D/AR
/// renderer can replace this presentation without changing product,
/// location, discovery or basket boundaries.
class WalkModeSpatialView extends StatelessWidget {
  const WalkModeSpatialView({
    super.key,
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
    this.headingDegrees = 0,
    this.onProductTap,
    this.onLook,
  });

  final WalkModeAisle aisle;
  final WalkModeSpatialPosition customerPosition;
  final List<WalkModeProductPlacement> visibleProducts;
  final double headingDegrees;
  final ValueChanged<WalkModeProductPlacement>? onProductTap;
  final ValueChanged<double>? onLook;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              children: [
                const Icon(Icons.view_in_ar_outlined),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    aisle.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Text('${visibleProducts.length} in view'),
              ],
            ),
          ),
          SizedBox(
            height: 430,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onHorizontalDragUpdate: onLook == null
                  ? null
                  : (details) => onLook!(details.delta.dx * 0.25),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final size = constraints.biggest;
                  return CustomPaint(
                    painter: _PerspectiveAislePainter(
                      aisle: aisle,
                      customerPosition: customerPosition,
                      visibleProducts: visibleProducts,
                      headingDegrees: headingDegrees,
                    ),
                    child: _ProductHitLayer(
                      size: size,
                      visibleProducts: visibleProducts,
                      customerPosition: customerPosition,
                      headingDegrees: headingDegrees,
                      onProductTap: onProductTap,
                    ),
                  );
                },
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
            child: Row(
              children: [
                const Icon(Icons.explore_outlined, size: 18),
                const SizedBox(width: 6),
                Text('Heading ${headingDegrees.toStringAsFixed(0)}°'),
                const Spacer(),
                Text(
                  'Position ${customerPosition.x.toStringAsFixed(1)}, '
                  '${customerPosition.y.toStringAsFixed(1)}',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProductHitLayer extends StatelessWidget {
  const _ProductHitLayer({
    required this.size,
    required this.visibleProducts,
    required this.customerPosition,
    required this.headingDegrees,
    this.onProductTap,
  });

  final Size size;
  final List<WalkModeProductPlacement> visibleProducts;
  final WalkModeSpatialPosition customerPosition;
  final double headingDegrees;
  final ValueChanged<WalkModeProductPlacement>? onProductTap;

  @override
  Widget build(BuildContext context) {
    if (onProductTap == null) return const SizedBox.expand();
    final projector = _PerspectiveProjector(size, headingDegrees);
    return Stack(
      children: visibleProducts.map((placement) {
        final point = projector.project(placement.position, customerPosition);
        if (point == null) return const SizedBox.shrink();
        return Positioned(
          left: point.dx - 30,
          top: point.dy - 30,
          width: 60,
          height: 60,
          child: Semantics(
            button: true,
            label: 'Discover ${placement.product.name}',
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: () => onProductTap!(placement),
                child: Tooltip(
                  message: placement.product.name,
                  child: const Icon(Icons.add_circle_outline, size: 30),
                ),
              ),
            ),
          ),
        );
      }).toList(growable: false),
    );
  }
}

class _PerspectiveAislePainter extends CustomPainter {
  const _PerspectiveAislePainter({
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
    required this.headingDegrees,
  });

  final WalkModeAisle aisle;
  final WalkModeSpatialPosition customerPosition;
  final List<WalkModeProductPlacement> visibleProducts;
  final double headingDegrees;

  @override
  void paint(Canvas canvas, Size size) {
    final projector = _PerspectiveProjector(size, headingDegrees);
    final horizon = size.height * 0.34;
    final vanishing = Offset(size.width / 2, horizon);

    final sky = Paint()..color = const Color(0xffeef3ef);
    final floor = Paint()..color = const Color(0xffd9ddd9);
    final shelf = Paint()..color = const Color(0xff8c918d);
    final shelfEdge = Paint()
      ..color = const Color(0xff5f6461)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    final aisleGlow = Paint()..color = const Color(0xfff7faf7);
    final productPaint = Paint()..color = const Color(0xff2e7d32);

    canvas.drawRect(Offset.zero & size, sky);

    final floorPath = Path()
      ..moveTo(0, size.height)
      ..lineTo(size.width, size.height)
      ..lineTo(size.width * 0.63, horizon)
      ..lineTo(size.width * 0.37, horizon)
      ..close();
    canvas.drawPath(floorPath, floor);

    final aislePath = Path()
      ..moveTo(size.width * 0.25, size.height)
      ..lineTo(size.width * 0.75, size.height)
      ..lineTo(size.width * 0.57, horizon)
      ..lineTo(size.width * 0.43, horizon)
      ..close();
    canvas.drawPath(aislePath, aisleGlow);

    _drawShelf(canvas, size, horizon, -1, shelf, shelfEdge);
    _drawShelf(canvas, size, horizon, 1, shelf, shelfEdge);

    for (final placement in aisle.products) {
      final point = projector.project(placement.position, customerPosition);
      if (point == null) continue;
      final depth = projector.depth(placement.position, customerPosition);
      final radius = (14 / depth).clamp(4.0, 12.0).toDouble();
      canvas.drawCircle(point, radius, productPaint);
    }

    final route = projector.routeToNearest(visibleProducts, customerPosition);
    if (route != null) {
      final routePaint = Paint()
        ..color = const Color(0xff2e7d32).withValues(alpha: 0.45)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3;
      final path = Path()..moveTo(size.width / 2, size.height * 0.91);
      path.lineTo(route.dx, route.dy);
      canvas.drawPath(path, routePaint);
    }

    _drawHud(canvas, size, vanishing);
  }

  void _drawShelf(
    Canvas canvas,
    Size size,
    double horizon,
    int side,
    Paint shelf,
    Paint edge,
  ) {
    final nearX = side < 0 ? size.width * 0.04 : size.width * 0.96;
    final farX = side < 0 ? size.width * 0.37 : size.width * 0.63;
    final topNear = size.height * 0.42;
    final bottomNear = size.height * 0.91;
    final topFar = horizon + 12;
    final bottomFar = horizon + 70;

    final path = Path()
      ..moveTo(nearX, topNear)
      ..lineTo(nearX, bottomNear)
      ..lineTo(farX, bottomFar)
      ..lineTo(farX, topFar)
      ..close();
    canvas.drawPath(path, shelf);
    canvas.drawPath(path, edge);

    for (var i = 1; i < 5; i++) {
      final t = i / 5;
      final yNear = topNear + (bottomNear - topNear) * t;
      final yFar = topFar + (bottomFar - topFar) * t;
      canvas.drawLine(Offset(nearX, yNear), Offset(farX, yFar), edge);
    }
  }

  void _drawHud(Canvas canvas, Size size, Offset vanishing) {
    final hud = Paint()..color = Colors.black.withValues(alpha: 0.42);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(14, 14, 190, 44),
        const Radius.circular(22),
      ),
      hud,
    );
    final text = TextPainter(
      text: const TextSpan(
        text: '  LOOK AROUND  ·  DISCOVER',
        style: TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    text.paint(canvas, const Offset(25, 29));

    final reticle = Paint()
      ..color = Colors.white.withValues(alpha: 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawCircle(vanishing, 8, reticle);
    canvas.drawLine(
      Offset(vanishing.dx - 14, vanishing.dy),
      Offset(vanishing.dx + 14, vanishing.dy),
      reticle,
    );
    canvas.drawLine(
      Offset(vanishing.dx, vanishing.dy - 14),
      Offset(vanishing.dx, vanishing.dy + 14),
      reticle,
    );
  }

  @override
  bool shouldRepaint(covariant _PerspectiveAislePainter oldDelegate) {
    return oldDelegate.aisle != aisle ||
        oldDelegate.customerPosition != customerPosition ||
        oldDelegate.visibleProducts != visibleProducts ||
        oldDelegate.headingDegrees != headingDegrees;
  }
}

class _PerspectiveProjector {
  const _PerspectiveProjector(this.size, this.headingDegrees);

  final Size size;
  final double headingDegrees;

  double depth(WalkModeSpatialPosition point, WalkModeSpatialPosition camera) {
    final dx = point.x - camera.x;
    final dy = point.y - camera.y;
    final angle = -headingDegrees * math.pi / 180;
    final forward = dx * math.sin(angle) + dy * math.cos(angle);
    return math.max(0.45, forward + 1.6);
  }

  Offset? project(
    WalkModeSpatialPosition point,
    WalkModeSpatialPosition camera,
  ) {
    final dx = point.x - camera.x;
    final dy = point.y - camera.y;
    final angle = -headingDegrees * math.pi / 180;
    final forward = dx * math.sin(angle) + dy * math.cos(angle);
    final lateral = dx * math.cos(angle) - dy * math.sin(angle);
    if (forward < -0.7 || forward > 12) return null;

    final d = math.max(0.55, forward + 1.7);
    final scale = 155 / d;
    final x = size.width / 2 + lateral * scale;
    final y = size.height * 0.34 + 175 / d;
    if (x < -60 || x > size.width + 60 || y < -60 || y > size.height + 60) {
      return null;
    }
    return Offset(x, y);
  }

  Offset? routeToNearest(
    List<WalkModeProductPlacement> products,
    WalkModeSpatialPosition camera,
  ) {
    Offset? best;
    var bestDepth = double.infinity;
    for (final placement in products) {
      final d = depth(placement.position, camera);
      if (d < bestDepth) {
        bestDepth = d;
        best = project(placement.position, camera);
      }
    }
    return best;
  }
}
