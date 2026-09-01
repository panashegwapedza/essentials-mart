import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:three_js/three_js.dart' as three;

import '../data/walk_mode_models.dart';

/// Immersive Walk Mode supermarket viewport.
///
/// The spatial contract remains renderer-neutral, while this implementation
/// renders a first-person WebGL store rather than a 2D map. Product identity
/// and basket authority remain outside the renderer.
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
        oldWidget.headingDegrees != widget.headingDegrees) {
      _syncCamera();
    }
  }

  Future<void> _setup() async {
    final height = threeJs.height == 0 ? 1.0 : threeJs.height;
    threeJs.camera = three.PerspectiveCamera(
      68,
      threeJs.width / height,
      0.08,
      180,
    );
    threeJs.camera.position.setValues(0, 1.68, 4.8);
    threeJs.scene = three.Scene();
    threeJs.scene.background = 0xffcbd7d0;

    threeJs.scene.add(three.AmbientLight(0xffffff, 0.68));
    final key = three.PointLight(0xffffff, 1.55);
    key.position.setValues(0, 6.5, 3);
    threeJs.scene.add(key);

    _buildStoreShell();
    _buildShelfBays();
    _buildProducts();
    _buildLighting();

    threeJs.addAnimationEvent((_) {
      if (_ready) _syncCamera();
    });
  }

  three.Mesh _box(double w, double h, double d, int color, {double shininess = 10}) {
    return three.Mesh(
      three.BoxGeometry(w, h, d),
      three.MeshPhongMaterial.fromMap({
        'color': color,
        'shininess': shininess,
      }),
    );
  }

  void _buildStoreShell() {
    final floor = _box(15.5, 0.08, 64, 0xffb9bfba, shininess: 4);
    floor.position.setValues(0, -0.04, -27);
    threeJs.scene.add(floor);

    // Long floor strips reinforce forward depth without becoming a map.
    for (var i = 0; i < 16; i++) {
      final strip = _box(0.035, 0.01, 3.5, 0xff8f9791);
      strip.position.setValues(-7.0 + i * 0.95, 0.01, -2 - (i % 8) * 7.0);
      threeJs.scene.add(strip);
    }

    final leftWall = _box(0.2, 5.2, 64, 0xffe5ebe7);
    leftWall.position.setValues(-7.7, 2.6, -27);
    threeJs.scene.add(leftWall);
    final rightWall = _box(0.2, 5.2, 64, 0xffe5ebe7);
    rightWall.position.setValues(7.7, 2.6, -27);
    threeJs.scene.add(rightWall);

    final back = _box(15.5, 5.2, 0.2, 0xffe5ebe7);
    back.position.setValues(0, 2.6, -59);
    threeJs.scene.add(back);

    final ceiling = _box(15.5, 0.12, 64, 0xfff7f9f7);
    ceiling.position.setValues(0, 5.25, -27);
    threeJs.scene.add(ceiling);

    // A prominent aisle header gives the space a supermarket identity.
    final header = _box(5.8, 0.72, 0.18, 0xff276749);
    header.position.setValues(0, 4.25, -4.0);
    threeJs.scene.add(header);
  }

  void _buildShelfBays() {
    const bayZ = [-3.5, -10.5, -17.5, -24.5, -31.5, -38.5, -45.5, -52.5];
    for (final side in const [-1.0, 1.0]) {
      final shelfX = side * 5.0;
      for (final z in bayZ) {
        final frame = _box(4.8, 4.05, 0.16, 0xff59615c);
        frame.position.setValues(shelfX, 2.02, z);
        threeJs.scene.add(frame);

        for (var level = 0; level < 4; level++) {
          final shelf = _box(4.7, 0.1, 1.05, 0xff747c76, shininess: 6);
          shelf.position.setValues(shelfX, 0.52 + level * 1.0, z);
          threeJs.scene.add(shelf);
        }

        final fascia = _box(4.75, 0.3, 0.08, 0xfff2f4f2);
        fascia.position.setValues(shelfX, 4.18, z);
        threeJs.scene.add(fascia);
      }
    }

    // End-cap displays at the near end make the first-person view feel like a
    // real retail aisle rather than an empty corridor.
    for (final side in const [-1.0, 1.0]) {
      final endcap = _box(1.5, 2.7, 1.25, 0xff68716b);
      endcap.position.setValues(side * 5.2, 1.35, -1.0);
      threeJs.scene.add(endcap);
      for (var row = 0; row < 3; row++) {
        final item = _box(0.62, 0.62, 0.38, _productColor(row + 2));
        item.position.setValues(side * 5.2, 0.65 + row * 0.72, -1.72);
        threeJs.scene.add(item);
      }
    }
  }

  void _buildProducts() {
    final products = widget.aisle.products;
    for (var index = 0; index < products.length; index++) {
      final placement = products[index];
      final side = index.isEven ? -1.0 : 1.0;
      final row = index % 4;
      final bay = index ~/ 8;
      final z = -3.25 - bay * 7.0;
      final x = side * (3.45 + (index % 2) * 0.65);
      final nearby = widget.visibleProducts.any(
        (candidate) => candidate.product.id == placement.product.id,
      );

      final product = _box(
        nearby ? 0.82 : 0.68,
        nearby ? 0.86 : 0.7,
        nearby ? 0.48 : 0.4,
        nearby ? 0xff1b8a4a : _productColor(index),
        shininess: nearby ? 34 : 12,
      );
      product.position.setValues(x, 0.88 + row * 0.93, z);
      product.userData['productId'] = placement.product.id;
      threeJs.scene.add(product);

      final priceRail = _box(0.78, 0.055, 0.045, 0xfff4f1df, shininess: 2);
      priceRail.position.setValues(x, 0.5 + row * 1.0, z - 0.26);
      threeJs.scene.add(priceRail);

      if (nearby) {
        final marker = _box(0.92, 0.04, 0.04, 0xffc8ffdc, shininess: 40);
        marker.position.setValues(x, 0.47 + row * 1.0, z - 0.29);
        threeJs.scene.add(marker);
      }
    }
  }

  void _buildLighting() {
    const lightZ = [-4.0, -13.0, -22.0, -31.0, -40.0, -49.0, -55.0];
    for (final z in lightZ) {
      final panel = _box(2.7, 0.04, 0.72, 0xfffdfdfb, shininess: 60);
      panel.position.setValues(0, 5.0, z);
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
    final position = widget.customerPosition;
    final x = position.x.clamp(-2.2, 2.2).toDouble();
    final z = (4.8 - position.y * 1.55).clamp(-57.0, 4.8).toDouble();
    threeJs.camera.position.setValues(x, 1.68, z);
    threeJs.camera.rotation.y = -widget.headingDegrees * math.pi / 180;
    threeJs.camera.rotation.x = 0;
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: Stack(
        fit: StackFit.expand,
        children: [
          threeJs.build(),
          if (!_ready)
            const ColoredBox(
              color: Color(0xffcbd7d0),
              child: Center(child: CircularProgressIndicator()),
            ),
          Positioned(
            top: 14,
            left: 14,
            child: _HudPill(
              icon: Icons.view_in_ar_rounded,
              text: widget.aisle.name,
            ),
          ),
          Positioned(
            top: 14,
            right: 14,
            child: _HudPill(
              icon: Icons.explore_rounded,
              text: '${widget.headingDegrees.round()}°',
            ),
          ),
          Center(
            child: IgnorePointer(
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withValues(alpha: .9), width: 1.5),
                  boxShadow: const [BoxShadow(blurRadius: 8)],
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
              bottom: 14,
              child: SizedBox(
                height: 54,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: math.min(widget.visibleProducts.length, 4),
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final placement = widget.visibleProducts[index];
                    final available = placement.product.available;
                    return ActionChip(
                      avatar: Icon(
                        available ? Icons.visibility_rounded : Icons.visibility_off_rounded,
                        size: 18,
                      ),
                      label: Text(placement.product.name),
                      backgroundColor: scheme.surface.withValues(alpha: .94),
                      onPressed: widget.onProductTap == null
                          ? null
                          : () => widget.onProductTap!(placement),
                    );
                  },
                ),
              ),
            ),
          if (widget.visibleProducts.isNotEmpty)
            Positioned(
              left: 18,
              top: 72,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: .52),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Text(
                    '${widget.visibleProducts.length} product${widget.visibleProducts.length == 1 ? '' : 's'} in your context',
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
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
            Text(
              text,
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }
}
