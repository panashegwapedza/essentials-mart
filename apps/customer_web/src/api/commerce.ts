export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export type BasketItem = {
  productId: string;
  quantity: number;
};

export type Basket = {
  items: BasketItem[];
};

/**
 * Governed commerce boundary.
 * The first browser slice uses a local adapter until the API contract is
 * connected to the Commerce API. Enterprise-authoritative state stays behind
 * this boundary.
 */
export interface CommerceClient {
  listProducts(): Promise<Product[]>;
  getBasket(): Promise<Basket>;
  addBasketItem(productId: string, quantity: number): Promise<Basket>;
}

const products: Product[] = [
  { id: 'rice-5kg', name: 'Rice 5kg', category: 'Staples', price: 8.99, available: true },
  { id: 'milk-2l', name: 'Fresh Milk 2L', category: 'Dairy', price: 2.49, available: true },
  { id: 'bread-white', name: 'White Bread', category: 'Bakery', price: 1.69, available: true },
  { id: 'eggs-12', name: 'Eggs 12 Pack', category: 'Dairy', price: 3.99, available: true },
  { id: 'washing-powder', name: 'Washing Powder 2kg', category: 'Household', price: 6.49, available: true },
  { id: 'cooking-oil-2l', name: 'Cooking Oil 2L', category: 'Pantry', price: 5.79, available: true },
];

let basket: Basket = { items: [] };

export const developmentCommerceClient: CommerceClient = {
  async listProducts() {
    return products;
  },
  async getBasket() {
    return basket;
  },
  async addBasketItem(productId, quantity) {
    const existing = basket.items.find((item) => item.productId === productId);
    if (existing) {
      basket = {
        items: basket.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      };
    } else {
      basket = { items: [...basket.items, { productId, quantity }] };
    }
    return basket;
  },
};
