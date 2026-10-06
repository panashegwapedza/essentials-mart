export const REFERENCE_LAYOUT = {
  layout: { id: 'reference-layout-v2', storeId: 'reference-store', version: 2 },
  aisles: [
    { id: 'produce', name: 'Produce', department: 'Fresh Produce', x: -11.5, z: 1.8, width: 2.7, length: 14 },
    { id: 'pantry', name: 'Pantry', department: 'Grocery', x: -7.0, z: 1.8, width: 2.7, length: 14 },
    { id: 'snacks', name: 'Snacks', department: 'Grocery', x: -2.5, z: 1.8, width: 2.7, length: 14 },
    { id: 'beverages', name: 'Beverages', department: 'Drinks', x: 2.2, z: 1.8, width: 2.7, length: 14 },
    { id: 'household', name: 'Household', department: 'Home Care', x: 6.9, z: 1.8, width: 2.7, length: 14 },
    { id: 'personal-care', name: 'Personal Care', department: 'Health & Beauty', x: 11.3, z: 1.8, width: 2.7, length: 10 },
    { id: 'specials', name: 'Specials', department: 'Promotions', x: 0, z: -7.0, width: 13.5, length: 2.2 }
  ],
  products: [],
  nodes: [
    { id: 'entrance', label: 'Entrance', nodeType: 'ENTRANCE', x: 0, y: 0, z: -15.5 },
    { id: 'carts', label: 'Shopping Carts', nodeType: 'SERVICE', x: -14.2, y: 0, z: -12.5 },
    { id: 'checkout', label: 'Checkout', nodeType: 'CHECKOUT', x: 10.8, y: 0, z: -12.5 },
    { id: 'exit', label: 'Exit', nodeType: 'EXIT', x: 14.2, y: 0, z: -15.5 },
    { id: 'dairy', label: 'Dairy', nodeType: 'DEPARTMENT', x: -9.8, y: 0, z: 12.8 },
    { id: 'frozen', label: 'Frozen Food', nodeType: 'DEPARTMENT', x: 0, y: 0, z: 12.8 },
    { id: 'meat', label: 'Meat & Seafood', nodeType: 'DEPARTMENT', x: 9.5, y: 0, z: 12.8 },
    { id: 'bakery', label: 'Bakery', nodeType: 'DEPARTMENT', x: -15.2, y: 0, z: 7.0 },
    { id: 'prepared', label: 'Prepared Foods', nodeType: 'DEPARTMENT', x: 15.2, y: 0, z: 7.0 }
  ],
  edges: []
} as const;
