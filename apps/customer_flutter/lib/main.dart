import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/auth/session.dart';
import 'core/config/app_config.dart';
import 'features/commerce/data/commerce_repository.dart';
import 'features/commerce/presentation/commerce_controller.dart';
import 'features/commerce/presentation/commerce_page.dart';

const _foreground = Color(0xFF0A0A0A);
const _primary = Color(0xFF171717);
const _background = Color(0xFFFFFFFF);
const _secondarySurface = Color(0xFFF5F5F5);
const _mutedForeground = Color(0xFF737373);
const _border = Color(0xFFE5E5E5);
const _success = Color(0xFF3A9742);
const _warning = Color(0xFFE9AB2B);
const _info = Color(0xFF0D7DD4);
const _danger = Color(0xFFE7000B);

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
    final scheme = ColorScheme.fromSeed(
      seedColor: _primary,
      brightness: Brightness.light,
    ).copyWith(
      primary: _primary,
      onPrimary: _background,
      secondary: _mutedForeground,
      onSecondary: _background,
      surface: _background,
      onSurface: _foreground,
      surfaceContainerHighest: _secondarySurface,
      outline: _border,
      error: _danger,
      onError: _background,
    );

    return MaterialApp(
      title: 'Essentials Mart',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: scheme,
        scaffoldBackgroundColor: _background,
        dividerColor: _border,
        cardColor: _background,
        textTheme: ThemeData.light().textTheme.apply(
          bodyColor: _foreground,
          displayColor: _foreground,
        ),
        inputDecorationTheme: const InputDecorationTheme(
          filled: true,
          fillColor: _secondarySurface,
          border: OutlineInputBorder(
            borderSide: BorderSide(color: _border),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: _border),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: _primary, width: 1.5),
          ),
        ),
      ),
      home: CommercePage(controller: controller),
    );
  }
}
