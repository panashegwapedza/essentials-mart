import { useEffect, useMemo, useState } from 'react';
import { commerceClient, type Basket, type Order, type Product } from './api/commerce';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<Basket>({ id: '', items: [] });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [busyProduct, setBusyProduct] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadShop() {
    setLoading(true);
    setError(null);
    try {
      const [catalogue, currentBasket] = await Promise.all([
        commerceClient.listProducts(),
        commerceClient.getBasket(),
      ]);
      setProducts(catalogue);
      setBasket(currentBasket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not load the shop. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadShop();
  }, []);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

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
  const basketTotal = basket.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const currency = basket.items[0]?.currency ?? products[0]?.currency ?? 'ZWG';

  async function addProduct(product: Product) {
    if (!product.available) return;
    setBusyProduct(product.id);
    setError(null);
    try {
      setBasket(await commerceClient.addBasketItem(product.id, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not add that item.');
    } finally {
      setBusyProduct(null);
    }
  }

  async function openProduct(product: Product) {
    setSelectedProduct(product);
    setProductLoading(true);
    setError(null);
    try {
      setSelectedProduct(await commerceClient.getProduct(product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not load that product.');
    } finally {
      setProductLoading(false);
    }
  }

  async function removeProduct(productId: string) {
    setBusyProduct(productId);
    setError(null);
    try {
      setBasket(await commerceClient.removeBasketItem(productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not remove that item.');
    } finally {
      setBusyProduct(null);
    }
  }

  async function checkout() {
    if (basketCount === 0) return;
    setCheckingOut(true);
    setError(null);
    try {
      const placedOrder = await commerceClient.checkout();
      setOrder(placedOrder);
      setBasket(await commerceClient.getBasket());
      setBasketOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout could not be completed.');
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-label="Essentials Mart home">
          <span className="brand-e">e</span>
          <span>Essentials Mart</span>
        </div>
        <div className="topbar-actions">
          <button className="quiet-button" type="button">Account</button>
          <button
            className="basket-button"
            type="button"
            aria-label={`Basket, ${basketCount} items`}
            aria-expanded={basketOpen}
            onClick={() => setBasketOpen((open) => !open)}
          >
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
          <button className="hero-card hero-card-button" type="button" onClick={() => setBasketOpen(true)}>
            <span>Basket</span>
            <strong>{basketCount} items</strong>
            <small>{basketCount > 0 ? `${currency} ${basketTotal.toFixed(2)}` : 'Ready when you are.'}</small>
          </button>
        </section>

        {order && (
          <section className="success-card" role="status">
            <div>
              <p className="eyebrow">ORDER PLACED</p>
              <strong>Thanks — your order is confirmed.</strong>
              <span>Order {order.id.slice(0, 8)} · {order.currency} {order.total.toFixed(2)}</span>
            </div>
            <button type="button" onClick={() => setOrder(null)}>Dismiss</button>
          </section>
        )}

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
                type="button"
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
                  <button className="product-image product-image-button" type="button" onClick={() => void openProduct(product)} aria-label={`View ${product.name}`}>
                    <span>{product.name.charAt(0)}</span>
                  </button>
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-footer">
                      <strong>{product.currency} {product.price.toFixed(2)}</strong>
                      <div className="product-actions">
                        <button className="secondary-button" type="button" onClick={() => void openProduct(product)}>View</button>
                        <button
                          type="button"
                          onClick={() => void addProduct(product)}
                          disabled={!product.available || busyProduct === product.id}
                        >
                          {busyProduct === product.id ? 'Adding…' : product.available ? 'Add' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {visibleProducts.length === 0 && <div className="state-card empty-results">No essentials match that search.</div>}
            </div>
          )}
        </section>
      </main>

      {selectedProduct && (
        <div className="product-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section className="product-detail" role="dialog" aria-modal="true" aria-labelledby="product-detail-heading" onClick={(event) => event.stopPropagation()}>
            <button className="detail-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close product details">×</button>
            <div className="detail-image" aria-hidden="true"><span>{selectedProduct.name.charAt(0)}</span></div>
            <div className="detail-content">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2 id="product-detail-heading">{selectedProduct.name}</h2>
              <strong className="detail-price">{selectedProduct.currency} {selectedProduct.price.toFixed(2)}</strong>
              <p className="detail-copy">Current catalogue information is confirmed through Commerce before this product is added to your basket.</p>
              <p className={selectedProduct.available ? 'availability available' : 'availability unavailable'}>
                {productLoading ? 'Refreshing availability…' : selectedProduct.available ? 'Available now' : 'Currently unavailable'}
              </p>
              <button className="detail-add" type="button" onClick={() => { void addProduct(selectedProduct); setSelectedProduct(null); }} disabled={!selectedProduct.available || productLoading || busyProduct === selectedProduct.id}>
                {busyProduct === selectedProduct.id ? 'Adding…' : 'Add to basket'}
              </button>
            </div>
          </section>
        </div>
      )}

      {basketOpen && (
        <>
          <button className="basket-backdrop" type="button" aria-label="Close basket" onClick={() => setBasketOpen(false)} />
          <aside className="basket-drawer" aria-label="Shopping basket">
            <div className="drawer-header">
              <div>
                <p className="eyebrow">YOUR BASKET</p>
                <h2>{basketCount} items</h2>
              </div>
              <button className="drawer-close" type="button" onClick={() => setBasketOpen(false)} aria-label="Close basket">×</button>
            </div>

            {basket.items.length === 0 ? (
              <div className="empty-basket">Your basket is empty. Add something from the shop.</div>
            ) : (
              <div className="basket-lines">
                {basket.items.map((item) => {
                  const product = productById.get(item.productId);
                  return (
                    <div className="basket-line" key={item.productId}>
                      <div>
                        <strong>{product?.name ?? item.productId}</strong>
                        <span>{item.quantity} × {item.currency} {item.unitPrice.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => void removeProduct(item.productId)}
                        disabled={busyProduct === item.productId}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="basket-summary">
              <span>Total</span>
              <strong>{currency} {basketTotal.toFixed(2)}</strong>
            </div>
            <button className="checkout-button" type="button" disabled={basketCount === 0 || checkingOut} onClick={() => void checkout()}>
              {checkingOut ? 'Placing order…' : 'Checkout'}
            </button>
          </aside>
        </>
      )}

      <footer>
        <span>Essentials Mart</span>
        <span>Built as a governed platform capability.</span>
      </footer>
    </div>
  );
}
