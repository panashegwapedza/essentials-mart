import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/auth/session.dart';
import 'core/capabilities/basket_capability.dart';
import 'core/config/app_config.dart';
import 'features/commerce/data/commerce_models.dart';
import 'features/commerce/data/commerce_repository.dart';
import 'features/commerce/presentation/commerce_controller.dart';
import 'features/commerce/presentation/commerce_page.dart';
import 'features/walk_mode/data/walk_mode_models.dart';
import 'features/walk_mode/data/walk_mode_product_asset.dart';
import 'features/walk_mode/presentation/walk_mode_controller.dart';
import 'features/walk_mode/presentation/walk_mode_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final config = AppConfig.fromEnvironment();
  const session = DevelopmentSessionProvider();
  final api = ApiClient(baseUrl: config.apiBaseUrl, session: session);
  final repository = CommerceRepository(api);
  final basketCapability = BasketCapability(repository);
  final commerceController = CommerceController(repository, basketCapability);
  final walkModeController = WalkModeController(basketCapability);

  runApp(
    EssentialsMartApp(
      commerceController: commerceController,
      walkModeController: walkModeController,
    ),
  );
  commerceController.load().then((_) {
    walkModeController.setStoreMap(_buildDevelopmentStoreMap(commerceController.products));
  });
}

/// Development fixture for the real supermarket-shaped Walk Mode contract.
///
/// This is intentionally a store layout, not a list of three abstract zones:
/// perimeter departments, a checkout/entrance bank, back-of-house space and
/// parallel gondola aisles are represented separately. When the Store/Layout
/// backend is introduced, it should populate this same contract.
WalkModeStoreMap _buildDevelopmentStoreMap(List<Product> products) {
  const aisleDefinitions = [
    ('a01', 'Breakfast & Cereals', -10.5),
    ('a02', 'Tea, Coffee & Spreads', -7.5),
    ('a03', 'Rice, Pasta & Grains', -4.5),
    ('a04', 'Canned & Cooking', -1.5),
    ('a05', 'Snacks & Biscuits', 1.5),
    ('a06', 'Beverages', 4.5),
    ('a07', 'Household Cleaning', 7.5),
    ('a08', 'Personal Care & Family', 10.5),
  ];

  const sections = <WalkModeStoreSection>[
    WalkModeStoreSection(
      id: 'entrance',
      name: 'Main Entrance',
      kind: WalkModeStoreSectionKind.entrance,
      x: 0,
      z: 19.5,
      width: 10,
      depth: 3,
    ),
    WalkModeStoreSection(
      id: 'checkout',
      name: 'Checkout',
      kind: WalkModeStoreSectionKind.checkout,
      x: 0,
      z: 15.5,
      width: 28,
      depth: 3.5,
    ),
    WalkModeStoreSection(
      id: 'customer-service',
      name: 'Customer Service',
      kind: WalkModeStoreSectionKind.service,
      x: -14.0,
      z: 15.5,
      width: 4,
      depth: 3.5,
    ),
    WalkModeStoreSection(
      id: 'produce',
      name: 'Fresh Produce',
      kind: WalkModeStoreSectionKind.produce,
      x: -13.5,
      z: 8.5,
      width: 6,
      depth: 8,
    ),
    WalkModeStoreSection(
      id: 'bakery',
      name: 'Bakery',
      kind: WalkModeStoreSectionKind.bakery,
      x: 13.5,
      z: 8.5,
      width: 6,
      depth: 8,
    ),
    WalkModeStoreSection(
      id: 'deli',
      name: 'Deli & Ready Meals',
      kind: WalkModeStoreSectionKind.deli,
      x: -13.5,
      z: -1.5,
      width: 6,
      depth: 6,
    ),
    WalkModeStoreSection(
      id: 'meat',
      name: 'Fresh Meat',
      kind: WalkModeStoreSectionKind.meat,
      x: 13.5,
      z: -1.5,
      width: 6,
      depth: 6,
    ),
    WalkModeStoreSection(
      id: 'dairy',
      name: 'Dairy & Chilled',
      kind: WalkModeStoreSectionKind.dairy,
      x: -13.5,
      z: -10.0,
      width: 6,
      depth: 6,
    ),
    WalkModeStoreSection(
      id: 'frozen',
      name: 'Frozen Foods',
      kind: WalkModeStoreSectionKind.frozen,
      x: 13.5,
      z: -10.0,
      width: 6,
      depth: 6,
    ),
    WalkModeStoreSection(
      id: 'backroom',
      name: 'Receiving & Back Stock',
      kind: WalkModeStoreSectionKind.other,
      x: 0,
      z: -19.0,
      width: 28,
      depth: 3,
    ),
  ];

  final placements = products.asMap().entries.map((entry) {
    final index = entry.key;
    final product = entry.value;
    final aisle = aisleDefinitions[index % aisleDefinitions.length];
    return (
      aisleId: aisle.$1,
      placement: WalkModeProductPlacement(
        product: product,
        position: WalkModeSpatialPosition(
          x: (index % 4).toDouble(),
          y: ((index ~/ 4) % 6).toDouble(),
        ),
        asset: WalkModeProductAsset(
          assetId: 'dev-${product.id}',
          productId: product.id,
          version: 'development-2',
          fidelity: WalkModeAssetFidelity.unavailable,
        ),
      ),
    );
  });

  final grouped = <String, List<WalkModeProductPlacement>>{};
  for (final item in placements) {
    grouped.putIfAbsent(item.aisleId, () => []).add(item.placement);
  }

  return WalkModeStoreMap(
    storeId: 'development-store',
    layoutVersion: 'development-2',
    sections: sections,
    storeWidth: 34,
    storeDepth: 42,
    aisles: aisleDefinitions
        .map(
          (definition) => WalkModeAisle(
            id: definition.$1,
            name: definition.$2,
            x: definition.$3,
            z: -1.5,
            length: 25,
            products: List.unmodifiable(grouped[definition.$1] ?? const []),
          ),
        )
        .toList(growable: false),
  );
}

class EssentialsMartApp extends StatelessWidget {
  const EssentialsMartApp({
    super.key,
    required this.commerceController,
    required this.walkModeController,
  });

  final CommerceController commerceController;
  final WalkModeController walkModeController;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Essentials Mart',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      home: CommercePage(controller: commerceController),
      routes: {
        '/walk-mode': (_) => WalkModePage(controller: walkModeController),
      },
    );
  }
}
