import { Product } from '@/components/ProductCard';

export const products: Product[] = [
  {
    id: 'sadhana-journal',
    title: 'The Sadhana Journal',
    description: 'A 90-day guided practice journal with daily prompts, tracking sheets, and sacred geometry for meditation focus.',
    price: 39,
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=600&fit=crop',
    in_stock: true,
  },
  {
    id: 'copper-vessel',
    title: 'Tamra Jal Copper Vessel',
    description: 'Authentic Ayurvedic copper vessel for storing water overnight. Naturally purifies and charges water with healing properties.',
    price: 67,
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=600&h=600&fit=crop',
    in_stock: true,
  },
  {
    id: 'binaural-collection',
    title: 'Sacred Frequencies Collection',
    description: 'Digital pack of 12 binaural beat tracks tuned to specific healing frequencies. Includes 432Hz, Solfeggio, and custom Vedic scales.',
    price: 29,
    type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    in_stock: true,
  },
  {
    id: 'meditation-cushion',
    title: 'Zafu Meditation Cushion',
    description: 'Handcrafted buckwheat hull meditation cushion. Ergonomic design supports proper posture for extended sits.',
    price: 89,
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=600&fit=crop',
    in_stock: true,
  },
  {
    id: 'mantra-deck',
    title: 'The Mantra Deck',
    description: '54 cards featuring powerful mantras with Sanskrit, pronunciation guide, meaning, and recommended practice. Perfect for daily sadhana.',
    price: 34,
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1529066792305-5e4efa40fde9?w=600&h=600&fit=crop',
    in_stock: true,
  },
  {
    id: 'pranayama-guide',
    title: 'Advanced Pranayama Masterguide',
    description: 'Comprehensive digital guide to 40+ pranayama techniques with video tutorials, contraindications, and progressive protocols.',
    price: 47,
    type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
    in_stock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
