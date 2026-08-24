import 'dart:convert';

import 'package:http/http.dart' as http;

import '../auth/session.dart';
import '../errors/api_exception.dart';

class ApiClient {
  ApiClient({required String baseUrl, required SessionProvider session, http.Client? client})
      : _baseUrl = baseUrl.replaceFirst(RegExp(r'/$'), ''),
        _session = session,
        _client = client ?? http.Client();

  final String _baseUrl;
  final SessionProvider _session;
  final http.Client _client;

  Future<dynamic> get(String path, {bool authenticated = false}) async {
    return _send('GET', path, authenticated: authenticated);
  }

  Future<dynamic> post(String path, {Map<String, dynamic>? body, bool authenticated = false}) async {
    return _send('POST', path, body: body, authenticated: authenticated);
  }

  Future<dynamic> delete(String path, {bool authenticated = false}) async {
    return _send('DELETE', path, authenticated: authenticated);
  }

  Future<dynamic> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
    required bool authenticated,
  }) async {
    final uri = Uri.parse('$_baseUrl$path');
    final headers = <String, String>{'Accept': 'application/json'};
    if (body != null) headers['Content-Type'] = 'application/json';
    if (authenticated) headers.addAll(await _session.headers());

    try {
      final response = switch (method) {
        'GET' => await _client.get(uri, headers: headers),
        'POST' => await _client.post(uri, headers: headers, body: jsonEncode(body)),
        'DELETE' => await _client.delete(uri, headers: headers),
        _ => throw StateError('Unsupported HTTP method: $method'),
      };

      dynamic decoded;
      if (response.body.isNotEmpty) {
        try {
          decoded = jsonDecode(response.body);
        } catch (_) {
          throw const ApiException(code: 'INVALID_RESPONSE', message: 'The server returned an invalid response.', statusCode: 502);
        }
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final error = decoded is Map<String, dynamic> ? decoded['error'] : null;
        throw ApiException(
          code: error is Map<String, dynamic> ? '${error['code'] ?? 'HTTP_ERROR'}' : 'HTTP_ERROR',
          message: error is Map<String, dynamic> ? '${error['message'] ?? 'Request failed.'}' : 'Request failed.',
          statusCode: response.statusCode,
        );
      }
      return decoded;
    } on ApiException {
      rethrow;
    } catch (_) {
      throw const ApiException(code: 'NETWORK', message: 'Unable to reach Essentials Mart.', statusCode: 0);
    }
  }
}
