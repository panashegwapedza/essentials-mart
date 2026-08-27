import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/auth/session.dart';
import 'core/capabilities/basket_capability.dart';
import 'core/config/app_config.dart';
import 'features/commerce/data/commerce_repository.dart';
import 'features/commerce/presentation/commerce_controller.dart';
import 'features/commerce/presentation/commerce_page.dart';
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
  commerceController.load();
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
