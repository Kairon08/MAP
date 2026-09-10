'use client'
import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FilterSidebar from '../../../components/FilterSidebar'
import HotelDrawer from '../../../components/HotelDrawer'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { CITIES, HOTELS, FILTER_DEFAULTS } from '../../../data/mockHotels'
import { fetchHotelsByCity } from '../../../lib/supabaseClient'

// Leaflet DOM/window ga bog'liq — SSR o'chirilgan holda yuklanadi
const MapComponent = dynamic(() => import('../../../components/MapComponent'), { ssr: false })

export default function CityPage({ params }) {
  const { citySlug } = params
  const city = CITIES[citySlug]

  const [hotels, setHotels] = useState([])
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const [selectedHotelId, setSelectedHotelId] = useState(null)
  const [showNeighborhood, setShowNeighborhood] = useState(false)

  // Supabase'dan urinib ko'radi, muvaffaqiyatsiz bo'lsa mock ma'lumotga qaytadi —
  // shu tufayli loyiha .env sozlanmagan holatda ham ishlab turadi (demo/portfolio uchun qulay)
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchHotelsByCity(citySlug)
        if (!cancelled && data?.length) setHotels(data)
        else if (!cancelled) setHotels(HOTELS.filter((h) => h.city_slug === citySlug))
      } catch {
        if (!cancelled) setHotels(HOTELS.filter((h) => h.city_slug === citySlug))
      }
    }
    load()
    return () => { cancelled = true }
  }, [citySlug])

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      if (h.price > filters.maxPrice) return false
      if (h.rating < filters.minRating) return false
      if (filters.wifi && !h.wifi) return false
      if (filters.pool && !h.pool) return false
      if (filters.bar && !h.bar) return false
      return true
    })
  }, [hotels, filters])

  const selectedHotel = hotels.find((h) => h.id === selectedHotelId) || null

  if (!city) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-base-900 text-mist-200">
        City not found.{' '}
        <Link href="/" className="text-teal-400 ml-2">Back to globe</Link>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex bg-base-900 overflow-hidden">
      <LanguageSwitcher />

      <div className="w-[300px] shrink-0 z-10 relative">
        <Link
          href="/"
          className="absolute top-5 left-5 z-20 w-8 h-8 rounded-full bg-base-800 border border-base-600 flex items-center justify-center text-mist-200 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
        >
          <ArrowLeft size={15} />
        </Link>
        <FilterSidebar
          cityName={city.name}
          filters={filters}
          onFilterChange={setFilters}
          resultsCount={filteredHotels.length}
        />
      </div>

      <div className="flex-1 relative">
        <MapComponent
          hotels={filteredHotels}
          city={city}
          selectedHotelId={selectedHotelId}
          onSelectHotel={(id) => { setSelectedHotelId(id); setShowNeighborhood(false) }}
          showNeighborhood={showNeighborhood}
        />
      </div>

      <HotelDrawer
        hotel={selectedHotel}
        onClose={() => { setSelectedHotelId(null); setShowNeighborhood(false) }}
        showNeighborhood={showNeighborhood}
        onToggleNeighborhood={() => setShowNeighborhood((v) => !v)}
      />
    </div>
  )
}
