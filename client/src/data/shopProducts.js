/**
 * Gym shop catalogue — update items, prices, and images here.
 * Place product photos in client/public/shop/ (e.g. /shop/tee-black.jpg).
 */
export const shopCategories = [
  { id: 'all', label: 'All' },
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accessories', label: 'Accessories' },
];

export const shopProducts = [
  {
    id: 'club-tee-black',
    name: 'Dube Boxing Club T-Shirt',
    category: 't-shirts',
    price: 'R350',
    description: 'Official club tee — comfortable cotton for training or casual wear.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    image: '/logo.jpg',
  },
  {
    id: 'club-tee-white',
    name: 'Dube Boxing Club T-Shirt (White)',
    category: 't-shirts',
    price: 'R350',
    description: 'White edition with club branding.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    image: '/logo.jpg',
  },
  {
    id: 'training-tee',
    name: 'Training Performance Tee',
    category: 't-shirts',
    price: 'R320',
    description: 'Lightweight, breathable fabric for intense sessions.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/logo.jpg',
  },
  {
    id: 'club-hoodie',
    name: 'Dube Boxing Club Hoodie',
    category: 'hoodies',
    price: 'R550',
    description: 'Warm hoodie with embroidered club logo.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    image: '/logo.jpg',
  },
  {
    id: 'zip-hoodie',
    name: 'Zip-Up Training Hoodie',
    category: 'hoodies',
    price: 'R580',
    description: 'Full-zip hoodie — ideal for warm-ups and cool-downs.',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: '/logo.jpg',
  },
  {
    id: 'gym-shorts',
    name: 'Club Training Shorts',
    category: 'accessories',
    price: 'R280',
    description: 'Flexible shorts built for boxing and gym work.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/logo.jpg',
  },
  {
    id: 'gym-bag',
    name: 'Dube Gym Bag',
    category: 'accessories',
    price: 'R420',
    description: 'Spacious bag for gloves, wraps, and gear.',
    sizes: null,
    image: '/logo.jpg',
  },
  {
    id: 'snapback',
    name: 'Club Snapback Cap',
    category: 'accessories',
    price: 'R200',
    description: 'Adjustable cap with embroidered logo.',
    sizes: ['One size'],
    image: '/logo.jpg',
  },
];
