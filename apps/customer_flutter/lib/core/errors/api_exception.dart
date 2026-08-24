class ApiException implements Exception {
  const ApiException({required this.code, required this.message, required this.statusCode});

  final String code;
  final String message;
  final int statusCode;

  bool get isNetworkFailure => statusCode == 0;

  @override
  String toString() => 'ApiException($statusCode, $code): $message';
}
