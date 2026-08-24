class Product {
  const Product({required this.id, required this.name, required this.amountMinor, required this.currency, required this.available});

  final String id;
  final String name;
  final int amountMinor;
  final String currency;
  final bool available;

  factory Product.fromJson(Map<String, dynamic> json) {
    final price = json['price'] as Map<String, dynamic>;
    return Product(
      id: '${json['id']}',
      name: '${json['name']}',
      amountMinor: (price['amountMinor'] as num).toInt(),
      currency: '${price['currency']}',
      available: json['available'] == true,
    );
  }
}

class BasketLine {
  const BasketLine({required this.productId, required this.quantity, required this.amountMinor, required this.currency});

  final String productId;
  final int quantity;
  final int amountMinor;
  final String currency;

  factory BasketLine.fromJson(Map<String, dynamic> json) {
    final price = json['unitPrice'] as Map<String, dynamic>;
    return BasketLine(
      productId: '${json['productId']}',
      quantity: (json['quantity'] as num).toInt(),
      amountMinor: (price['amountMinor'] as num).toInt(),
      currency: '${price['currency']}',
    );
  }
}

class Basket {
  const Basket({required this.id, required this.lines});

  final String id;
  final List<BasketLine> lines;

  factory Basket.fromJson(Map<String, dynamic> json) {
    final rawLines = (json['lines'] as List<dynamic>? ?? const []);
    return Basket(
      id: '${json['id']}',
      lines: rawLines.map((line) => BasketLine.fromJson(line as Map<String, dynamic>)).toList(growable: false),
    );
  }
}
