export const Products = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    slug: 'sauce-labs-backpack',
    price: 29.99,
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    slug: 'sauce-labs-bike-light',
    price: 9.99,
  },
  BOLT_TSHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    slug: 'sauce-labs-bolt-t-shirt',
    price: 15.99,
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    slug: 'sauce-labs-fleece-jacket',
    price: 49.99,
  },
  ONESIE: {
    name: 'Sauce Labs Onesie',
    slug: 'sauce-labs-onesie',
    price: 7.99,
  },
  RED_TSHIRT: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    slug: 'test.allthethings()-t-shirt-(red)',
    price: 15.99,
  },
} as const;

export const TOTAL_PRODUCTS = 6;

export const SortOptions = {
  NAME_ASC: 'az',
  NAME_DESC: 'za',
  PRICE_ASC: 'lohi',
  PRICE_DESC: 'hilo',
} as const;

export type SortOption = (typeof SortOptions)[keyof typeof SortOptions];

export const ExpectedSortOrder = {
  NAME_ASC: [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
  ],
  NAME_DESC: [
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Onesie',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Backpack',
  ],
  PRICE_ASC: ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'],
  PRICE_DESC: ['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99'],
} as const;
