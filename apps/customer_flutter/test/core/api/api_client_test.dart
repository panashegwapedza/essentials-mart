import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import 'package:essentials_mart_customer/core/api/api_client.dart';
import 'package:essentials_mart_customer/core/auth/session.dart';
import 'package:essentials_mart_customer/core/errors/api_exception.dart';

class FakeClient extends http.BaseClient {
  FakeClient(this.response);

  final http.Response response;

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    return http.StreamedResponse(
      Stream<List<int>>.value(response.bodyBytes),
      response.statusCode,
      headers: response.headers,
    );
  }
}

void main() {
  test('maps machine-readable API errors without matching free-text', () async {
    final client = ApiClient(
      baseUrl: 'http://example.test',
      session: const DevelopmentSessionProvider(),
      client: FakeClient(
        http.Response('{"error":{"code":"PRODUCT_UNAVAILABLE","message":"temporarily unavailable"}}', 409),
      ),
    );

    expect(
      () => client.get('/products/bread'),
      throwsA(
        isA<ApiException>()
            .having((e) => e.code, 'code', 'PRODUCT_UNAVAILABLE')
            .having((e) => e.statusCode, 'statusCode', 409)
            .having((e) => e.message, 'message', 'temporarily unavailable'),
      ),
    );
  });
}
