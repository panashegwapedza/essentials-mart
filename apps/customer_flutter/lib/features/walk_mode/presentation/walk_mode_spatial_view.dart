import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:three_js/three_js.dart' as three;

import '../data/walk_mode_models.dart';

/// First-person Living Digital Supermarket viewport.
///
/// The renderer builds the whole store around the shopper: entrance, checkout
/// bank, perimeter departments, back-of-house and a regular gondola aisle grid.
/// The camera is placed inside the selected aisle, so the shopper experiences a
/// real supermarket rather than an abstract aisle canvas.
class WalkModeSpatialView extends StatefulWidget {
  const WalkModeSpatialView({
    super.key,
    required this.storeMap,
    required this.aisle,
    required this.customerPosition,
    required this.visibleProducts,
    this.headingDegrees = 0,
    this.onProductTap,
    this.onLook,
  });

  final WalkModeStoreMap storeMap;
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

    if (oldWidget.aisle.id != widget.aisle.id) {
      _removeProductMeshes();
      _buildProducts();
    }

    if (oldWidget.customerPosition != widget.customerPosition ||
        oldWidget.headingDegrees != widget.headingDegrees ||
        oldWidget.aisle.id != widget.aisle.id) {
      _syncCamera();
    }
  }

  Future<void> _setup() async {
    final height = threeJs.height == 0 ? 1.0 : threeJs.height;
    threeJs.camera = three.PerspectiveCamera(74, threeJs.width / height, 0.05, 180);
    threeJs.scene = three.Scene();
    threeJs.scene.background = 0xffdfe5e1;

    threeJs.scene.add(three.AmbientLight(0xffffff, 0.62));
    final key = three.PointLight(0xffffff, 2.4);
    key.position.setValues(-3, 9, 6);
    threeJs.scene.add(key);
    final fill = three.PointLight(0xdceee4, 1.1);
    fill.position.setValues(10, 5, -12);
    threeJs.scene.add(fill);

    _buildStoreShell();
    _buildPerimeterDepartments();
    _buildCheckoutAndEntrance();
    _buildGondolaAisles();
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

  void _buildStoreShell() {
    final floor = _box(widget.storeMap.storeWidth, 0.08, widget.storeMap.storeDepth, 0xffc4cbc6, shininess: 2);
    floor.position.setValues(0, -0.04, 0);
    threeJs.scene.add(floor);

    final ceiling = _box(widget.storeMap.storeWidth, 0.12, widget.storeMap.storeDepth, 0xfff7f9f7);
    ceiling.position.setValues(0, 5.8, 0);
    threeJs.scene.add(ceiling);

    for (final x in const [-17.0, 17.0]) {
      final wall = _box(0.2, 5.6, widget.storeMap.storeDepth, 0xffe6ebe8);
      wall.position.setValues(x, 2.8, 0);
      threeJs.scene.add(wall);
    }

    for (final z in const [-21.0, 21.0]) {
      final wall = _box(widget.storeMap.storeWidth, 5.6, 0.2, 0xffe6ebe8);
      wall.position.setValues(0, 2.8, z);
      threeJs.scene.add(wall);
    }

    final frontLoop = _box(30, 0.025, 2.6, 0xffd6ddd8);
    frontLoop.position.setValues(0, 0.015, 12.7);
    threeJs.scene.add(frontLoop);
    final rearLoop = _box(30, 0.025, 2.4, 0xffd6ddd8);
    rearLoop.position.setValues(0, 0.015, -14.0);
    threeJs.scene.add(rearLoop);
  }

  void _buildPerimeterDepartments() {
    for (final section in widget.storeMap.sections) {
      if (section.kind == WalkModeStoreSectionKind.entrance ||
          section.kind == WalkModeStoreSectionKind.checkout) {
        continue;
      }

      final baseColor = _sectionColor(section.kind);
      final base = _box(section.width, 0.22, section.depth, baseColor, shininess: 12);
      base.position.setValues(section.x, 0.11, section.z);
      threeJs.scene.add(base);

      final caseHeight = section.kind == WalkModeStoreSectionKind.produce ? 1.45 : 2.35;
      final caseDepth = math.min(section.depth * 0.55, 2.4);
      final display = _box(section.width - 0.35, caseHeight, caseDepth, _caseColor(section.kind), shininess: 18);
      display.position.setValues(section.x, caseHeight / 2 + 0.2, section.z);
      threeJs.scene.add(display);

      final header = _box(section.width - 0.45, 0.34, 0.12, baseColor, shininess: 22);
      header.position.setValues(section.x, 4.05, section.z - section.depth / 2 + 0.22);
      threeJs.scene.add(header);

      if (section.kind == WalkModeStoreSectionKind.produce) {
        for (var i = -1; i <= 1; i++) {
          final island = _box(1.35, 0.72, 2.1, 0xff8a6848, shininess: 5);
          island.position.setValues(section.x + i * 1.8, 0.55, section.z + 0.7);
          threeJs.scene.add(island);
          final fruit = _box(1.05, 0.3, 1.55, 0xffd6a33b, shininess: 4);
          fruit.position.setValues(section.x + i * 1.8, 1.03, section.z + 0.7);
          threeJs.scene.add(fruit);
        }
      }
    }
  }

  WalkModeStoreSection? _section(WalkModeStoreSectionKind kind) {
    for (final section in widget.storeMap.sections) {
      if (section.kind == kind) return section;
    }
    return null;
  }

  void _buildCheckoutAndEntrance() {
    final checkout = _section(WalkModeStoreSectionKind.checkout);
    if (checkout != null) {
      final counter = _box(checkout.width, 1.15, 1.1, 0xff515a55, shininess: 18);
      counter.position.setValues(checkout.x, 0.58, checkout.z);
      threeJs.scene.add(counter);

      for (var i = 0; i < 7; i++) {
        final x = -11.5 + i * 3.85;
        final lane = _box(2.5, 0.8, 0.7, 0xff707a73, shininess: 12);
        lane.position.setValues(x, 1.45, checkout.z - 0.85);
        threeJs.scene.add(lane);
        final screen = _box(0.65, 0.45, 0.12, 0xff1d2924, shininess: 25);
        screen.position.setValues(x, 1.95, checkout.z - 0.95);
        threeJs.scene.add(screen);
      }
    }

    final entrance = _section(WalkModeStoreSectionKind.entrance);
    if (entrance != null) {
      for (final x in [-entrance.width / 2 + 1.0, entrance.width / 2 - 1.0]) {
        final gate = _box(0.22, 2.1, 0.32, 0xff216b45, shininess: 22);
        gate.position.setValues(x, 1.05, entrance.z);
        threeJs.scene.add(gate);
      }
    }
  }

  void _buildGondolaAisles() {
    for (final aisle in widget.storeMap.aisles) {
      final x = aisle.x;
      final z = aisle.z;
      final length = aisle.length;

      for (final side in const [-1.0, 1.0]) {
        final shelfX = x + side * 1.05;
        final back = _box(0.82, 3.85, length, 0xff626b65, shininess: 8);
        back.position.setValues(shelfX, 2.0, z);
        threeJs.scene.add(back);

        for (var level = 0; level < 5; level++) {
          final shelf = _box(0.96, 0.075, length - 0.18, 0xff858e88, shininess: 6);
          shelf.position.setValues(shelfX + side * 0.18, 0.55 + level * 0.72, z);
          threeJs.scene.add(shelf);
        }
      }

      for (final end in [-1.0, 1.0]) {
        final endcap = _box(2.55, 2.25, 0.62, 0xff747d77, shininess: 10);
        endcap.position.setValues(x, 1.12, z + end * (length / 2));
        threeJs.scene.add(endcap);
      }

      final sign = _box(2.2, 0.08, 0.38, 0xfff4f6f3, shininess: 24);
      sign.position.setValues(x, 4.55, z + length / 2 - 0.45);
      threeJs.scene.add(sign);
    }
  }

  void _removeProductMeshes() {
    final removable = <three.Object3D>[];
    for (final child in threeJs.scene.children) {
      if (child.userData['walkProduct'] == true) removable.add(child);
    }
    for (final child in removable) {
      threeJs.scene.remove(child);
    }
  }

  void _buildProducts() {
    for (final aisle in widget.storeMap.aisles) {
      for (var index = 0; index < aisle.products.length; index++) {
        final placement = aisle.products[index];
        final p = placement.position;
        final side = index.isEven ? -1.0 : 1.0;
        final shelfX = aisle.x + side * 1.32;
        final z = aisle.z + 10.4 - p.y * 3.75 + p.z;
        final shelfLevel = index % 5;
        final xOffset = (p.x - 1.5) * 0.18;
        final highlighted = aisle.id == widget.aisle.id &&
            widget.visibleProducts.any((candidate) => candidate.product.id == placement.product.id);

        final product = _box(
          highlighted ? 0.66 : 0.5,
          highlighted ? 0.72 : 0.58,
          highlighted ? 0.42 : 0.34,
          highlighted ? 0xff1e9b55 : _productColor(index),
          shininess: highlighted ? 36 : 10,
        );
        product.position.setValues(shelfX + xOffset, 0.82 + shelfLevel * 0.72, z);
        product.userData['productId'] = placement.product.id;
        product.userData['walkProduct'] = true;
        threeJs.scene.add(product);

        if (highlighted) {
          final marker = _box(0.86, 0.045, 0.045, 0xffd9ffe7, shininess: 50);
          marker.position.setValues(shelfX + xOffset, 0.49 + shelfLevel * 0.72, z - side * 0.28);
          marker.userData['walkProduct'] = true;
          threeJs.scene.add(marker);
        }
      }
    }
  }

  void _buildCeilingLights() {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 2; j++) {
        final panel = _box(2.5, 0.045, 0.58, 0xfffdfdfb, shininess: 55);
        panel.position.setValues(-7.0 + j * 14.0, 5.48, 10.0 - i * 6.0);
        threeJs.scene.add(panel);
      }
    }
  }

  int _sectionColor(WalkModeStoreSectionKind kind) {
    switch (kind) {
      case WalkModeStoreSectionKind.produce:
        return 0xff5f8f4e;
      case WalkModeStoreSectionKind.bakery:
        return 0xffa97945;
      case WalkModeStoreSectionKind.deli:
        return 0xff9b5f62;
      case WalkModeStoreSectionKind.meat:
        return 0xff9d5555;
      case WalkModeStoreSectionKind.dairy:
        return 0xff5c82a6;
      case WalkModeStoreSectionKind.frozen:
        return 0xff4f7fa8;
      case WalkModeStoreSectionKind.beverages:
        return 0xff6a79a9;
      case WalkModeStoreSectionKind.service:
        return 0xff777d78;
      case WalkModeStoreSectionKind.checkout:
        return 0xff515a55;
      case WalkModeStoreSectionKind.entrance:
        return 0xff216b45;
      case WalkModeStoreSectionKind.other:
        return 0xff666e69;
    }
  }

  int _caseColor(WalkModeStoreSectionKind kind) {
    switch (kind) {
      case WalkModeStoreSectionKind.produce:
      case WalkModeStoreSectionKind.bakery:
        return 0xffd6b36a;
      case WalkModeStoreSectionKind.deli:
      case WalkModeStoreSectionKind.meat:
        return 0xffc7a7a4;
      case WalkModeStoreSectionKind.dairy:
      case WalkModeStoreSectionKind.frozen:
        return 0xffb9d1dc;
      default:
        return 0xffa7aeaa;
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
    final x = (widget.aisle.x + (p.x - 2.0) * 0.55).clamp(-14.2, 14.2).toDouble();
    final z = (widget.aisle.z + 10.4 - p.y * 3.75).clamp(-18.5, 12.0).toDouble();
    threeJs.camera.position.setValues(x, 1.64, z);
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
              color: Color(0xffdfe5e1),
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
                color: Colors.black.withValues(alpha: .55),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.swipe_rounded, color: Colors.white, size: 17),
                    SizedBox(width: 7),
                    Text('Swipe to look', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700)),
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
