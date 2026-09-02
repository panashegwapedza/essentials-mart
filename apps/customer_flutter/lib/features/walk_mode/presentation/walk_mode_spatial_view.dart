import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:three_js/three_js.dart' as three;

import '../data/walk_mode_models.dart';

/// First-person Living Digital Supermarket viewport.
///
/// The renderer is deliberately presentation-only. Store/product identity and
/// spatial coordinates come from the Walk Mode contract; the renderer does
/// not invent product locations or basket truth.
class WalkModeSpatialView extends StatefulWidget {
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
  State<WalkModeSpatialView> createState() => _WalkModeSpatialViewState();
}

class _WalkModeSpatialViewState extends State<WalkModeSpatialView> {
  late final three.ThreeJS threeJs;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    threeJs = three.ThreeJS(
      onSetupComplete: () {
        _ready = true;
        _syncCamera();
        if (mounted) setState(() {});
      },
      setup: _setup,
    );
  }

  @override
  void didUpdateWidget(covariant WalkModeSpatialView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_ready) return;
    if (oldWidget.customerPosition != widget.customerPosition ||
        oldWidget.headingDegrees != widget.headingDegrees ||
        oldWidget.aisle.id != widget.aisle.id) {
      _syncCamera();
    }
  }

  Future<void> _setup() async {
    final height = threeJs.height == 0 ? 1.0 : threeJs.height;
    threeJs.camera = three.PerspectiveCamera(72, threeJs.width / height, 0.05, 160);
    threeJs.scene = three.Scene();
    threeJs.scene.background = 0xffc8d1cc;

    threeJs.scene.add(three.AmbientLight(0xffffff, 0.58));
    final key = three.PointLight(0xffffff, 1.8);
    key.position.setValues(0, 6.0, 2.5);
    threeJs.scene.add(key);

    _buildEnvironment();
    _buildShelves();
    _buildProducts();
    _buildCeilingLights();

    threeJs.addAnimationEvent((_) {
      if (_ready) _syncCamera();
    });
  }

  three.Mesh _box(double w, double h, double d, int color, {double shininess = 8}) {
    return three.Mesh(
      three.BoxGeometry(w, h, d),
      three.MeshPhongMaterial.fromMap({'color': color, 'shininess': shininess}),
    );
  }

  void _buildEnvironment() {
    final floor = _box(15.5, 0.08, 72, 0xffb7beb9, shininess: 2);
    floor.position.setValues(0, -0.04, -31);
    threeJs.scene.add(floor);

    // Long aisle markings create depth without turning the experience into a map.
    for (var i = 0; i < 10; i++) {
      final line = _box(0.025, 0.012, 5.0, 0xff8c958e);
      line.position.setValues(-6.6 + i * 1.45, 0.012, -3 - (i % 3) * 7);
      threeJs.scene.add(line);
    }

    for (final side in const [-1.0, 1.0]) {
      final wall = _box(0.18, 5.4, 72, 0xffe5eae7);
      wall.position.setValues(side * 7.7, 2.7, -31);
      threeJs.scene.add(wall);
    }

    final ceiling = _box(15.5, 0.12, 72, 0xfff7f9f7);
    ceiling.position.setValues(0, 5.35, -31);
    threeJs.scene.add(ceiling);

    final header = _box(6.2, 0.72, 0.16, 0xff216b45, shininess: 18);
    header.position.setValues(0, 4.35, -4.2);
    threeJs.scene.add(header);
  }

  void _buildShelves() {
    const bayZ = [-4.0, -11.0, -18.0, -25.0, -32.0, -39.0, -46.0, -53.0];

    for (final side in const [-1.0, 1.0]) {
      final shelfX = side * 5.0;
      for (final z in bayZ) {
        final back = _box(4.7, 4.1, 0.14, 0xff59615c);
        back.position.setValues(shelfX, 2.1, z);
        threeJs.scene.add(back);

        for (var level = 0; level < 4; level++) {
          final shelf = _box(4.65, 0.09, 1.02, 0xff737b75, shininess: 5);
          shelf.position.setValues(shelfX, 0.5 + level * 1.0, z - 0.15);
          threeJs.scene.add(shelf);
        }

        final fascia = _box(4.72, 0.28, 0.08, 0xfff2f4f2);
        fascia.position.setValues(shelfX, 4.18, z - 0.12);
        threeJs.scene.add(fascia);
      }
    }
  }

  void _buildProducts() {
    for (var index = 0; index < widget.aisle.products.length; index++) {
      final placement = widget.aisle.products[index];
      final p = placement.position;

      // The spatial contract's x/y/z are authoritative. Development data uses
      // x=0..4 and y as the aisle-depth coordinate; map that into the 3D aisle.
      final x = (p.x - 2.0) * 1.65;
      final z = -3.1 - p.y * 1.7;
      final shelfLevel = index % 4;
      final side = index.isEven ? -1.0 : 1.0;
      final shelfX = side * 5.0;
      final actualX = shelfX + (x * 0.16);
      final highlighted = widget.visibleProducts.any(
        (candidate) => candidate.product.id == placement.product.id,
      );

      final width = highlighted ? 0.72 : 0.58;
      final height = highlighted ? 0.78 : 0.62;
      final depth = highlighted ? 0.46 : 0.38;
      final product = _box(
        width,
        height,
        depth,
        highlighted ? 0xff1e9b55 : _productColor(index),
        shininess: highlighted ? 36 : 10,
      );
      product.position.setValues(
        actualX,
        0.88 + shelfLevel * 0.88,
        z,
      );
      product.userData['productId'] = placement.product.id;
      threeJs.scene.add(product);

      if (highlighted) {
        final marker = _box(0.9, 0.045, 0.045, 0xffd9ffe7, shininess: 50);
        marker.position.setValues(actualX, 0.49 + shelfLevel * 0.88, z - 0.28);
        threeJs.scene.add(marker);
      }
    }
  }

  void _buildCeilingLights() {
    for (var i = 0; i < 9; i++) {
      final panel = _box(2.8, 0.045, 0.62, 0xfffdfdfb, shininess: 55);
      panel.position.setValues(0, 5.05, -3.0 - i * 6.5);
      threeJs.scene.add(panel);
    }
  }

  int _productColor(int index) {
    const palette = <int>[
      0xff2e7d32,
      0xff1565c0,
      0xffef6c00,
      0xff8e24aa,
      0xff00838f,
      0xffc62828,
      0xff6d4c41,
      0xff455a64,
    ];
    return palette[index % palette.length];
  }

  void _syncCamera() {
    if (!_ready) return;
    final p = widget.customerPosition;
    final x = (p.x - 2.0).clamp(-2.3, 2.3).toDouble();
    final z = (4.8 - p.y * 1.7).clamp(-57.0, 4.8).toDouble();
    threeJs.camera.position.setValues(x, 1.62, z);
    threeJs.camera.rotation.y = -widget.headingDegrees * math.pi / 180;
    threeJs.camera.rotation.x = 0;
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: Stack(
        fit: StackFit.expand,
        children: [
          GestureDetector(
            onHorizontalDragUpdate: widget.onLook == null
                ? null
                : (details) => widget.onLook!(details.delta.dx * 0.65),
            child: threeJs.build(),
          ),
          if (!_ready)
            const ColoredBox(
              color: Color(0xffc8d1cc),
              child: Center(child: CircularProgressIndicator()),
            ),
          Positioned(
            top: 14,
            left: 14,
            child: _HudPill(icon: Icons.storefront_rounded, text: widget.aisle.name),
          ),
          Positioned(
            top: 14,
            right: 14,
            child: _HudPill(icon: Icons.explore_rounded, text: '${widget.headingDegrees.round()}°'),
          ),
          Positioned(
            left: 14,
            bottom: 14,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: .52),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.swipe_rounded, color: Colors.white, size: 17),
                    const SizedBox(width: 7),
                    Text('Swipe to look', style: TextStyle(color: Colors.white.withValues(alpha: .96), fontSize: 12, fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
            ),
          ),
          Center(
            child: IgnorePointer(
              child: Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withValues(alpha: .9), width: 1.5),
                  boxShadow: const [BoxShadow(blurRadius: 9)],
                ),
                child: const Center(
                  child: SizedBox(width: 4, height: 4, child: DecoratedBox(decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white))),
                ),
              ),
            ),
          ),
          if (widget.visibleProducts.isNotEmpty)
            Positioned(
              left: 14,
              right: 14,
              top: 64,
              child: SizedBox(
                height: 48,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: math.min(widget.visibleProducts.length, 4),
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final placement = widget.visibleProducts[index];
                    return ActionChip(
                      avatar: Icon(
                        placement.product.available ? Icons.visibility_rounded : Icons.visibility_off_rounded,
                        size: 17,
                      ),
                      label: Text(placement.product.name),
                      backgroundColor: scheme.surface.withValues(alpha: .94),
                      onPressed: widget.onProductTap == null ? null : () => widget.onProductTap!(placement),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    threeJs.dispose();
    super.dispose();
  }
}

class _HudPill extends StatelessWidget {
  const _HudPill({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: .55),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: Colors.white, size: 17),
            const SizedBox(width: 7),
            Text(text, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}
