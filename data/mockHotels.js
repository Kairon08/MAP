// Bu fayl ikki maqsadga xizmat qiladi:
// 1) Supabase ulanmagan holatda frontendni sinash uchun fallback ma'lumot
// 2) supabase/schema.sql dagi jadvallarga seed qilish uchun namuna
// Har bir hotel obyekti "hotels" jadvali qatoriga to'g'ridan-to'g'ri mos keladi.

export const CITIES = {
  tashkent: { slug: 'tashkent', name: 'Tashkent', lat: 41.2995, lng: 69.2401, zoom: 13 },
  samarkand: { slug: 'samarkand', name: 'Samarkand', lat: 39.6542, lng: 66.9597, zoom: 13 },
  tokyo: { slug: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503, zoom: 12 },
  paris: { slug: 'paris', name: 'Paris', lat: 48.8566, lng: 2.3522, zoom: 13 },
}

export const HOTELS = [
  {
    id: 'h1',
    city_slug: 'tashkent',
    name: 'Hilton Tashkent City',
    lat: 41.3111,
    lng: 69.2797,
    price: 68,
    currency: '$',
    rating: 4.7,
    is_featured: true,
    wifi: true,
    pool: true,
    bar: true,
    description: 'Premium hotel in the city center with panoramic windows and a modern interior.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
    affiliate_url: 'https://www.booking.com/searchresults.html?ss=Hilton+Tashkent+City',
    reviews: [{ author: 'Aziz K.', rating: 5, text: 'Excellent service, great breakfast.' }],
  },
  {
    id: 'h2',
    city_slug: 'tashkent',
    name: 'Wyndham Tashkent',
    lat: 41.2939,
    lng: 69.2183,
    price: 47,
    currency: '$',
    rating: 4.4,
    is_featured: false,
    wifi: true,
    pool: false,
    bar: true,
    description: 'Convenient for business travelers, close to the metro station.',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    affiliate_url: 'https://www.booking.com/searchresults.html?ss=Wyndham+Tashkent',
    reviews: [{ author: 'Jasur B.', rating: 4, text: 'Fast Wi-Fi, good for work.' }],
  },
  {
    id: 'h3',
    city_slug: 'tokyo',
    name: 'Shibuya Sky Suites',
    lat: 35.6595,
    lng: 139.7005,
    price: 120,
    currency: '$',
    rating: 4.8,
    is_featured: true,
    wifi: true,
    pool: false,
    bar: true,
    description: 'Neon-lit views over Shibuya crossing, steps from the station.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'],
    affiliate_url: 'https://www.booking.com/searchresults.html?ss=Shibuya+Sky',
    reviews: [{ author: 'Kenji M.', rating: 5, text: 'The night view alone is worth it.' }],
  },
  {
    id: 'h4',
    city_slug: 'paris',
    name: 'Hôtel Le Marais',
    lat: 48.8606,
    lng: 2.3622,
    price: 195,
    currency: '€',
    rating: 4.8,
    is_featured: false,
    wifi: true,
    pool: false,
    bar: true,
    description: 'Boutique hotel in the historic Marais district.',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    affiliate_url: 'https://www.booking.com/searchresults.html?ss=Hotel+Le+Marais',
    reviews: [{ author: 'Claire M.', rating: 5, text: 'Charming and perfectly located.' }],
  },
]

export const NEARBY_PLACES = {
  h1: [
    { id: 'p1', name: 'Amir Temur Square', type: 'sight', lat: 41.3117, lng: 69.2794 },
    { id: 'p2', name: 'Caravan Restaurant', type: 'restaurant', lat: 41.3095, lng: 69.2765 },
  ],
  h3: [
    { id: 'p3', name: 'Shibuya Crossing', type: 'sight', lat: 35.6595, lng: 139.7005 },
    { id: 'p4', name: 'JR Shibuya Station', type: 'transport', lat: 35.6580, lng: 139.7016 },
  ],
  h4: [
    { id: 'p5', name: 'Place des Vosges', type: 'sight', lat: 48.8555, lng: 2.3655 },
    { id: 'p6', name: 'Café Charlot', type: 'restaurant', lat: 48.8626, lng: 2.3629 },
  ],
}

export const FILTER_DEFAULTS = { maxPrice: 500, minRating: 0, wifi: false, pool: false, bar: false }
