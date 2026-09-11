import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { commerceClient, convertDisplayAmount, formatMoney, type Product, type SupportedCurrency } from './api/commerce';
import './catalogue-variants.css';

type Family = {
  key: string;
  label: string;
  category: string;
  products: Product[];
};

const readShopFilters = () => ({
  query: (document.querySelector<HTMLInputElement>('.search-box input')?.value ?? '').trim().toLowerCase(),
  category: document.querySelector<HTMLButtonElement>('.category.active')?.textContent?.trim() ?? 'All',
});

function clickOriginalAdd(product: Product) {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.product-card'));
  const card = cards.find((candidate) => candidate.querySelector('h3')?.textContent?.trim() === product.name);
  const addButton = card?.querySelector<HTMLButtonElement>('.product-actions button:not(.secondary-button)');
  addButton?.click();
}

export default function CatalogueVariants() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState(readShopFilters);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void commerceClient.listProducts()
      .then((items) => { if (mounted) setProducts(items); })
      .catch(() => { if (mounted) setProducts([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    document.body.classList.add('catalogue-variants-enabled');
    const shop = document.querySelector('.shop-section');
    if (!shop) return () => document.body.classList.remove('catalogue-variants-enabled');

    const sync = () => setFilters(readShopFilters());
    const observer = new MutationObserver(sync);
    observer.observe(shop, { subtree: true, attributes: true, attributeFilter: ['class', 'value'] });
    shop.addEventListener('input', sync);
    shop.addEventListener('click', sync);
    sync();

    return () => {
      observer.disconnect();
      shop.removeEventListener('input', sync);
      shop.removeEventListener('click', sync);
      document.body.classList.remove('catalogue-variants-enabled');
    };
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const queryMatch = !filters.query || [product.name, product.category, product.productFamily, product.brand, product.variantLabel, product.sizeLabel]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(filters.query));
    return (filters.category === 'All' || product.category === filters.category) && queryMatch;
  }), [products, filters]);

  const families = useMemo<Family[]>(() => {
    const map = new Map<string, Family>();
    for (const product of visibleProducts) {
      const label = product.productFamily?.trim() || product.name;
      const key = label.toLowerCase();
      const family = map.get(key) ?? { key, label, category: product.category, products: [] };
      family.products.push(product);
      map.set(key, family);
    }
    return Array.from(map.values());
  }, [visibleProducts]);

  const host = document.querySelector('.shop-section');
  if (!host || loading) return null;

  const currency = (visibleProducts[0]?.currency ?? 'USD') as SupportedCurrency;

  return createPortal(
    <>
      <div className="catalogue-family-grid" aria-label="Product families">
        {families.map((family) => {
          const variants = family.products;
          const minPrice = Math.min(...variants.map((product) => convertDisplayAmount(product.price, product.currency, currency)));
          const multiVariant = variants.length > 1;
          return (
            <article className="catalogue-family-card" key={family.key}>
              <button
                className="catalogue-family-main"
                type="button"
                onClick={() => multiVariant ? setSelectedFamily(family) : clickOriginalAdd(variants[0])}
                disabled={!variants.some((product) => product.available)}
              >
                <span className="catalogue-family-image">{family.label.charAt(0)}</span>
                <span className="product-category">{family.category}</span>
                <strong>{family.label}</strong>
                <span className="catalogue-family-subtitle">
                  {multiVariant ? `${Math.min(3, variants.length)} choices · from ${formatMoney(minPrice, currency)}` : formatMoney(minPrice, currency)}
                </span>
              </button>
              {multiVariant && (
                <button className="catalogue-family-choice" type="button" onClick={() => setSelectedFamily(family)}>
                  Choose {Math.min(3, variants.length)}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {selectedFamily && (
        <div className="catalogue-choice-backdrop" role="presentation" onClick={() => setSelectedFamily(null)}>
          <section className="catalogue-choice-panel" role="dialog" aria-modal="true" aria-label={`Choose ${selectedFamily.label}`} onClick={(event) => event.stopPropagation()}>
            <button className="catalogue-choice-close" type="button" onClick={() => setSelectedFamily(null)} aria-label="Close">×</button>
            <p className="eyebrow">CHOOSE YOUR {selectedFamily.label.toUpperCase()}</p>
            <h2>{selectedFamily.label}</h2>
            <p className="catalogue-choice-copy">Pick the option that suits your household. We keep the choice set compact.</p>
            <div className="catalogue-choice-list">
              {selectedFamily.products.slice(0, 3).map((product) => (
                <button
                  className="catalogue-choice-option"
                  key={product.id}
                  type="button"
                  disabled={!product.available}
                  onClick={() => { clickOriginalAdd(product); setSelectedFamily(null); }}
                >
                  <span>
                    <strong>{product.brand || product.name}</strong>
                    <small>{[product.variantLabel, product.sizeLabel].filter(Boolean).join(' · ') || product.category}</small>
                  </span>
                  <b>{formatMoney(convertDisplayAmount(product.price, product.currency, currency), currency)}</b>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>,
    host,
  );
}
