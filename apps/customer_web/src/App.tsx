import { useEffect, useMemo, useState } from 'react';
import { developmentCommerceClient, type Basket, type Product } from './api/commerce';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<Basket>({ items: [] });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      developmentCommerceClient.listProducts(),
      developmentCommerceClient.getBasket(),
    ])
      .then(([catalogue, currentBasket]) => {
        setProducts(catalogue);
        setBasket(currentBasket);
      })
      .catch(() => setError('We could not load the shop. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const basketCount = basket.items.reduce((total, item) => total + item.quantity, 0);

  async function addProduct(product: Product) {
    if (!product.available) return;
    const nextBasket = await developmentCommerceClient.addBasketItem(product.id, 1);
    setBasket(nextBasket);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-label="Essentials Mart home">
          <span className="brand-e">e</span>
          <span>Essentials Mart</span>
        </div>
        <div className="topbar-actions">
          <button className="quiet-button">Account</button>
          <button className="basket-button" aria-label={`Basket, ${basketCount} items`}>
            Basket <span>{basketCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">HOUSEHOLD CARE PLATFORM</p>
            <h1>Everything your household needs, in one place.</h1>
            <p className="hero-copy">
              Start with everyday essentials. Your basket, orders and future household
              services will grow from the same trusted platform.
            </p>
          </div>
          <div className="hero-card">
            <span>Basket</span>
            <strong>{basketCount} items</strong>
            <small>Ready when you are.</small>
          </div>
        </section>

        <section className="shop-section" aria-labelledby="shop-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SHOP</p>
              <h2 id="shop-heading">Everyday essentials</h2>
            </div>
            <label className="search-box">
              <span className="sr-only">Search products</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search essentials"
              />
            </label>
          </div>

          <div className="category-row" aria-label="Product categories">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'category active' : 'category'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && <div className="state-card">Loading the catalogue…</div>}
          {error && <div className="state-card error">{error}</div>}

          {!loading && !error && (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image" aria-hidden="true">
                    <span>{product.name.charAt(0)}</span>
                  </div>
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-footer">
                      <strong>${product.price.toFixed(2)}</strong>
                      <button onClick={() => void addProduct(product)} disabled={!product.available}>
                        {product.available ? 'Add' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>Essentials Mart</span>
        <span>Built as a governed platform capability.</span>
      </footer>
    </div>
  );
}
