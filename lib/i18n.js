'use client'
import { createContext, useContext, useState } from 'react'

export const LANGUAGES = [
  { code: 'eng', flag: '🇺🇸', label: 'ENG' },
  { code: 'uzb', flag: '🇺🇿', label: 'UZB' },
  { code: 'rus', flag: '🇷🇺', label: 'RUS' },
]

const DICT = {
  eng: {
    searchPlaceholder: 'Search a city — Tokyo, Paris, Tashkent...',
    heroTitle: 'Explore the world.\nBook the stay.',
    heroSubtitle: 'Spin the globe, drop a pin, find your next hotel.',
    filterCity: 'City',
    filterPrice: 'Price (per night)',
    filterUpTo: 'up to',
    filterRating: 'Minimum rating',
    filterAll: 'All',
    amenities: 'Amenities',
    wifi: 'Free Wi-Fi',
    pool: 'Pool',
    bar: 'Bar',
    resultsFound: 'hotels found',
    reviews: 'reviews',
    showNeighborhood: 'Show nearby places',
    hideNeighborhood: 'Hide neighborhood',
    perNight: 'per night',
    bookVia: 'Book via Booking.com',
    featured: 'Featured',
    sponsoredNote: 'Sponsored placement',
    reviewsTitle: 'Reviews',
  },
  uzb: {
    searchPlaceholder: 'Shahar qidiring — Tokio, Parij, Toshkent...',
    heroTitle: 'Dunyoni kashf eting.\nMehmonxona banding.',
    heroSubtitle: 'Globusni aylantiring, nuqta qo\'ying, keyingi mehmonxonangizni toping.',
    filterCity: 'Shahar',
    filterPrice: 'Narx (kuniga)',
    filterUpTo: 'gacha',
    filterRating: 'Minimal reyting',
    filterAll: 'Barchasi',
    amenities: 'Qulayliklar',
    wifi: 'Bepul Wi-Fi',
    pool: 'Basseyn',
    bar: 'Bar',
    resultsFound: 'ta mehmonxona topildi',
    reviews: 'ta sharh',
    showNeighborhood: 'Atrofdagi joylarni ko\'rsatish',
    hideNeighborhood: 'Atrofni yashirish',
    perNight: 'bir kecha',
    bookVia: 'Booking.com orqali band qilish',
    featured: 'Tavsiya etilgan',
    sponsoredNote: 'Reklama joylashuvi',
    reviewsTitle: 'Sharhlar',
  },
  rus: {
    searchPlaceholder: 'Найдите город — Токио, Париж, Ташкент...',
    heroTitle: 'Исследуй мир.\nЗабронируй отель.',
    heroSubtitle: 'Вращайте глобус, ставьте метку, находите отель.',
    filterCity: 'Город',
    filterPrice: 'Цена (за ночь)',
    filterUpTo: 'до',
    filterRating: 'Минимальный рейтинг',
    filterAll: 'Все',
    amenities: 'Удобства',
    wifi: 'Бесплатный Wi-Fi',
    pool: 'Бассейн',
    bar: 'Бар',
    resultsFound: 'отелей найдено',
    reviews: 'отзывов',
    showNeighborhood: 'Показать окрестности',
    hideNeighborhood: 'Скрыть окрестности',
    perNight: 'за ночь',
    bookVia: 'Забронировать через Booking.com',
    featured: 'Рекомендуемый',
    sponsoredNote: 'Спонсируемое размещение',
    reviewsTitle: 'Отзывы',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('eng')
  const t = (key) => DICT[lang]?.[key] ?? DICT.eng[key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
