import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/auth/session.dart';
import 'core/capabilities/basket_capability.dart';
import 'core/config/app_config.dart';
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

WalkModeStoreMap _buildDevelopmentStoreMap(List<Product> products) {
  const aisleDefinitions = [
    ('fresh', 'Fresh & Chilled'),
    ('pantry', 'Pantry'),
    ('household', 'Household & Personal Care'),
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
          x: (index % 3) * 2.0,
          y: (index ~/ 3) * 1.5,
        ),
        asset: WalkModeProductAsset(
          assetId: 'dev-${product.id}',
          productId: product.id,
          version: 'development-1',
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
    layoutVersion: 'development-1',
    aisles: aisleDefinitions
        .map(
          (definition) => WalkModeAisle(
            id: definition.$1,
            name: definition.$2,
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
