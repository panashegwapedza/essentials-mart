class Order {
  const Order({
    required this.id,
    required this.totalMinor,
    required this.currency,
    required this.status,
  });

  final String id;
  final int totalMinor;
  final String currency;
  final String status;

  factory Order.fromJson(Map<String, dynamic> json) {
    final total = json['total'] as Map<String, dynamic>;
    return Order(
      id: '${json['id']}',
      totalMinor: (total['amountMinor'] as num).toInt(),
      currency: '${total['currency']}',
      status: '${json['status']}',
    );
  }
}
