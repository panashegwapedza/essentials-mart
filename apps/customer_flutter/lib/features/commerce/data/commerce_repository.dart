import '../../../core/api/api_client.dart';
import 'commerce_models.dart';

abstract interface class BasketRepository {
  Future<Basket> getBasket();

  Future<Basket> addToBasket(String productId, int quantity);

  Future<Basket> removeFromBasket(String productId);
}

class CommerceRepository implements BasketRepository {
  const CommerceRepository(this._api);

  final ApiClient _api;

  Future<List<Product>> listProducts() async {
    final body = await _api.get('/products') as Map<String, dynamic>;
    final products = (body['products'] as List<dynamic>? ?? const []);
    return products
        .map((item) => Product.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  @override
  Future<Basket> getBasket() async {
    final body = await _api.get('/basket', authenticated: true);
    return Basket.fromJson(body as Map<String, dynamic>);
  }

  @override
  Future<Basket> addToBasket(String productId, int quantity) async {
    final body = await _api.post(
      '/basket/items',
      authenticated: true,
      body: {'productId': productId, 'quantity': quantity},
    );
    return Basket.fromJson(body as Map<String, dynamic>);
  }

  @override
  Future<Basket> removeFromBasket(String productId) async {
    final encodedId = Uri.encodeComponent(productId);
    final body = await _api.delete(
      '/basket/items/$encodedId',
      authenticated: true,
    );
    return Basket.fromJson(body as Map<String, dynamic>);
  }
}
