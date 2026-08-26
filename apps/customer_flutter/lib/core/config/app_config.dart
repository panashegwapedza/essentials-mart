class AppConfig {
  const AppConfig({required this.apiBaseUrl});

  final String apiBaseUrl;

  factory AppConfig.fromEnvironment() {
    const configured = String.fromEnvironment(
      'ESSENTIALS_MART_API_URL',
      defaultValue: 'http://127.0.0.1:3000',
    );
    return const AppConfig(apiBaseUrl: configured);
  }
}
