import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:three_js/three_js.dart' as three;

import '../data/walk_mode_models.dart';

/// The actual Walk Mode viewport.
///
/// This is a WebGL 3D supermarket scene, not a painted 2D map. The renderer
/// consumes the existing renderer-neutral Walk Mode spatial contract while
/// product/basket authority remains outside the renderer.
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
    if (_ready &&
        (oldWidget.customerPosition != widget.customerPosition ||
            oldWidget.headingDegrees != widget.headingDegrees ||
            oldWidget.aisle != widget.aisle)) {
      _syncCamera();
    }
  }

  Future<void> _setup() async {
    final height = threeJs.height == 0 ? 1.0 : threeJs.height;
    threeJs.camera = three.PerspectiveCamera(
      62,
      threeJs.width / height,
      0.1,
      200,
    );
    threeJs.camera.position.setValues(0, 1.72, 4.5);
    threeJs.scene = three.Scene();
    threeJs.scene.background = 0xffdfe9e3;

    final ambient = three.AmbientLight(0xffffff, 0.72);
    threeJs.scene.add(ambient);

    final keyLight = three.PointLight(0xffffff, 1.3);
    keyLight.position.setValues(0, 8, 3);
    threeJs.scene.add(keyLight);

    _buildEnvironment();
    _buildProducts();

    threeJs.addAnimationEvent((_) {
      if (_ready) _syncCamera();
    });
  }

  three.Mesh _box(double width, double height, double depth, int color) {
    final geometry = three.BoxGeometry(width, height, depth);
    final material = three.MeshPhongMaterial.fromMap({
      'color': color,
      'shininess': 18,
    });
    return three.Mesh(geometry, material);
  }

  void _buildEnvironment() {
    final floor = _box(16, 0.12, 48, 0xffc9cfca);
    floor.position.setValues(0, -0.06, -20);
    threeJs.scene.add(floor);

    final ceiling = _box(16, 0.12, 48, 0xfff5f7f5);
    ceiling.position.setValues(0, 5.2, -20);
    threeJs.scene.add(ceiling);

    for (final side in const [-1.0, 1.0]) {
      final wall = _box(0.18, 5.2, 48, 0xffe6ebe7);
      wall.position.setValues(side * 7.2, 2.6, -20);
      threeJs.scene.add(wall);

      for (var row = 0; row < 4; row++) {
        final shelf = _box(5.4, 0.12, 0.55, 0xff7d8580);
        shelf.position.setValues(
          side * 4.35,
          0.65 + row * 1.05,
          -2 - row * 6.0,
        );
        threeJs.scene.add(shelf);
      }

      const uprights = [-2.0, -8.0, -14.0, -20.0, -26.0];
      for (final z in uprights) {
        final post = _box(0.14, 4.3, 0.16, 0xff606762);
        post.position.setValues(side * 1.8, 2.15, z);
        threeJs.scene.add(post);
      }
    }

    final sign = _box(5.0, 0.7, 0.16, 0xff276749);
    sign.position.setValues(0, 4.15, -3.2);
    threeJs.scene.add(sign);
  }

  void _buildProducts() {
    final products = widget.aisle.products;
    for (var index = 0; index < products.length; index++) {
      final placement = products[index];
      final side = index.isEven ? -1.0 : 1.0;
      final row = index % 3;
      final depthIndex = index ~/ 6;
      final z = -2.3 - depthIndex * 5.0;
      final x = side * (5.15 + (index % 2) * 0.55);
      final color = _productColor(index);

      final product = _box(0.62, 0.72, 0.38, color);
      product.position.setValues(x, 0.98 + row * 1.05, z);
      product.userData['productId'] = placement.product.id;
      threeJs.scene.add(product);

      final cap = _box(0.68, 0.06, 0.44, 0xfff5f5f5);
      cap.position.setValues(x, 1.37 + row * 1.05, z);
      threeJs.scene.add(cap);
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
    ];
    return palette[index % palette.length];
  }

  void _syncCamera() {
    if (!_ready) return;
    final position = widget.customerPosition;
    final x = position.x.clamp(-2.0, 2.0).toDouble();
    final z = (-position.y - 1.0).clamp(-34.0, 4.0).toDouble();
    threeJs.camera.position.setValues(x, 1.72, z);
    threeJs.camera.rotation.y = -widget.headingDegrees * math.pi / 180;
    threeJs.camera.rotation.x = 0;
  }

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
                    widget.aisle.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Text('${widget.visibleProducts.length} nearby'),
              ],
            ),
          ),
          SizedBox(
            height: 500,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onHorizontalDragUpdate: widget.onLook == null
                  ? null
                  : (details) => widget.onLook!(details.delta.dx * 0.25),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  threeJs.build(),
                  if (!_ready)
                    const ColoredBox(
                      color: Color(0xffdfe9e3),
                      child: Center(child: CircularProgressIndicator()),
                    ),
                  Positioned(
                    top: 14,
                    left: 14,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.55),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                        child: Text(
                          'LIVING DIGITAL SUPERMARKET  ·  3D',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.4,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    right: 14,
                    top: 14,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.55),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                        child: Text(
                          'LOOK ${widget.headingDegrees.round()}°',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Center(
                    child: IgnorePointer(
                      child: Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white70),
                        ),
                      ),
                    ),
                  ),
                  if (widget.visibleProducts.isNotEmpty)
                    Positioned(
                      right: 14,
                      bottom: 14,
                      left: 14,
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: widget.visibleProducts.take(4).map((placement) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ActionChip(
                                avatar: const Icon(Icons.visibility_outlined, size: 17),
                                label: Text(placement.product.name),
                                onPressed: widget.onProductTap == null
                                    ? null
                                    : () => widget.onProductTap!(placement),
                              ),
                            );
                          }).toList(growable: false),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
            child: Row(
              children: [
                const Icon(Icons.explore_outlined, size: 18),
                const SizedBox(width: 6),
                Text(
                  'Position ${widget.customerPosition.x.toStringAsFixed(1)}, '
                  '${widget.customerPosition.y.toStringAsFixed(1)}',
                ),
                const Spacer(),
                Text('Heading ${widget.headingDegrees.toStringAsFixed(0)}°'),
              ],
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
