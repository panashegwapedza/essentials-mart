import '../../../core/api/api_client.dart';
import 'commerce_models.dart';

class CommerceRepository {
  const CommerceRepository(this._api);

  final ApiClient _api;

  Future<List<Product>> listProducts() async {
    final body = await _api.get('/products');
    final products = (body['products'] as List<dynamic>? ?? const []);
    return products.map((item) => Product.fromJson(item as Map<String, dynamic>)).toList(growable: false);
  }

  Future<Basket> getBasket() async {
    final body = await _api.get('/basket', authenticated: true);
    return Basket.fromJson(body as Map<String, dynamic>);
  }

  Future<Basket> addToBasket(String productId, int quantity) async {
    final body = await _api.post(
      '/basket/items',
      authenticated: true,
      body: {'productId': productId, 'quantity': quantity},
    );
    return Basket.fromJson(body as Map<String, dynamic>);
  }

  Future<Basket> removeFromBasket(String productId) async {
    final body = await _api.delete('/basket/items/$productId', authenticated: true);
    return Basket.fromJson(body as Map<String, dynamic>);
  }
}
