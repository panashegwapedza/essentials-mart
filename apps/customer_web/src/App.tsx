import { useEffect, useMemo, useState } from 'react';
import { commerceClient, type Basket, type Order, type Product } from './api/commerce';
import './styles.css';

const emptyBasket: Basket = { id: '', items: [] };

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<Basket>(emptyBasket);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [busyProduct, setBusyProduct] = useState<string | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [catalogue, currentBasket] = await Promise.all([
        commerceClient.listProducts(),
        commerceClient.getBasket(),
      ]);
      setProducts(catalogue);
      setBasket(currentBasket);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not load the shop. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
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
  const basketTotal = basket.items.reduce(
    (total, item) => total + item.unitPrice.amountMinor * item.quantity,
    0,
  );
  const currency = basket.items[0]?.unitPrice.currency ?? products[0]?.price.currency ?? 'USD';

  const formatMoney = (amountMinor: number, moneyCurrency = currency) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: moneyCurrency }).format(amountMinor / 100);

  async function addProduct(product: Product) {
    if (!product.available) return;
    setBusyProduct(product.id);
    setError(null);
    try {
      setBasket(await commerceClient.addBasketItem(product.id, 1));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not add that product.');
    } finally {
      setBusyProduct(null);
    }
  }

  async function removeProduct(productId: string) {
    setBusyProduct(productId);
    setError(null);
    try {
      setBasket(await commerceClient.removeBasketItem(productId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not remove that product.');
    } finally {
      setBusyProduct(null);
    }
  }

  async function checkout() {
    if (basketCount === 0) return;
    setCheckoutBusy(true);
    setError(null);
    try {
      const placedOrder = await commerceClient.checkout();
      setOrder(placedOrder);
      setBasket(await commerceClient.getBasket());
      setBasketOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Checkout could not be completed.');
    } finally {
      setCheckoutBusy(false);
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
          <button className="quiet-button">Account</button>
          <button className="basket-button" onClick={() => setBasketOpen(true)} aria-label={`Basket, ${basketCount} items`}>
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
          <button className="hero-card" onClick={() => setBasketOpen(true)}>
            <span>Basket</span>
            <strong>{basketCount} items</strong>
            <small>{basketCount ? formatMoney(basketTotal) : 'Ready when you are.'}</small>
          </button>
        </section>

        {order && (
          <section className="success-card" role="status">
            <div>
              <p className="eyebrow">ORDER PLACED</p>
              <h2>Thanks — your order is confirmed.</h2>
              <p>Order {order.id.slice(0, 8)} · {formatMoney(order.total.amountMinor, order.total.currency)}</p>
            </div>
            <button onClick={() => setOrder(null)}>Continue shopping</button>
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
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search essentials" />
            </label>
          </div>

          <div className="category-row" aria-label="Product categories">
            {categories.map((item) => (
              <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>
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
                  <div className="product-image" aria-hidden="true"><span>{product.name.charAt(0)}</span></div>
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-footer">
                      <strong>{formatMoney(product.price.amountMinor, product.price.currency)}</strong>
                      <button onClick={() => void addProduct(product)} disabled={!product.available || busyProduct === product.id}>
                        {busyProduct === product.id ? 'Adding…' : product.available ? 'Add' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {basketOpen && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setBasketOpen(false)}>
          <aside className="basket-drawer" role="dialog" aria-modal="true" aria-labelledby="basket-heading" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div><p className="eyebrow">YOUR BASKET</p><h2 id="basket-heading">{basketCount} items</h2></div>
              <button className="close-button" onClick={() => setBasketOpen(false)} aria-label="Close basket">×</button>
            </div>
            {basketCount === 0 ? (
              <div className="empty-basket">Your basket is empty.<br />Add a few everyday essentials to get started.</div>
            ) : (
              <>
                <div className="basket-lines">
                  {basket.items.map((item) => {
                    const product = products.find((candidate) => candidate.id === item.productId);
                    return (
                      <div className="basket-line" key={item.productId}>
                        <div><strong>{product?.name ?? item.productId}</strong><small>{item.quantity} × {formatMoney(item.unitPrice.amountMinor, item.unitPrice.currency)}</small></div>
                        <button onClick={() => void removeProduct(item.productId)} disabled={busyProduct === item.productId}>Remove</button>
                      </div>
                    );
                  })}
                </div>
                <div className="basket-total"><span>Total</span><strong>{formatMoney(basketTotal)}</strong></div>
                <button className="checkout-button" onClick={() => void checkout()} disabled={checkoutBusy}>
                  {checkoutBusy ? 'Placing order…' : 'Checkout'}
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      <footer><span>Essentials Mart</span><span>Built as a governed platform capability.</span></footer>
    </div>
  );
}
