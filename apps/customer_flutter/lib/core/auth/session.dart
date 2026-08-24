abstract interface class SessionProvider {
  Future<Map<String, String>> headers();
}

class DevelopmentSessionProvider implements SessionProvider {
  const DevelopmentSessionProvider({this.customerId = 'customer-1'});

  final String customerId;

  @override
  Future<Map<String, String>> headers() async {
    return {
      'X-Dev-Customer-Id': customerId,
    };
  }
}
