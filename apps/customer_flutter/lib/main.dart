import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/auth/session.dart';
import 'core/config/app_config.dart';
import 'features/commerce/data/commerce_repository.dart';
import 'features/commerce/presentation/commerce_controller.dart';
import 'features/commerce/presentation/commerce_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final config = AppConfig.fromEnvironment();
  const session = DevelopmentSessionProvider();
  final api = ApiClient(baseUrl: config.apiBaseUrl, session: session);
  final repository = CommerceRepository(api);
  final controller = CommerceController(repository);

  runApp(EssentialsMartApp(controller: controller));
  controller.load();
}

class EssentialsMartApp extends StatelessWidget {
  const EssentialsMartApp({super.key, required this.controller});

  final CommerceController controller;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Essentials Mart',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      home: CommercePage(controller: controller),
    );
  }
}
