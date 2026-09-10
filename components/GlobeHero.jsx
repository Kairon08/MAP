'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Globe from 'react-globe.gl'
import { Search } from 'lucide-react'
import { CITIES } from '../data/mockHotels'
import { useLanguage } from '../lib/i18n'

const CITY_POINTS = Object.values(CITIES).map((c) => ({
  lat: c.lat,
  lng: c.lng,
  slug: c.slug,
  name: c.name,
}))

export default function GlobeHero() {
  const globeRef = useRef()
  const containerRef = useRef()
  const router = useRouter()
  const { t } = useLanguage()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isFlying, setIsFlying] = useState(false)

  // Konteyner o'lchamiga moslashtirish (responsiv globus)
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Avto-aylanish va boshlang'ich kamera burchagi
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.6
    globe.controls().enableZoom = false
    globe.pointOfView({ lat: 25, lng: 40, altitude: 2.2 }, 0)
  }, [])

  function handleQueryChange(value) {
    setQuery(value)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    setSuggestions(
      CITY_POINTS.filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()))
    )
  }

  function flyToCity(city) {
    const globe = globeRef.current
    if (!globe) return
    setIsFlying(true)
    globe.controls().autoRotate = false

    // Silliq fly-to: avval balandroqdan shahar ustiga, keyin shahar sahifasiga o'tamiz
    globe.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.35 }, 1600)

    setTimeout(() => {
      router.push(`/city/${city.slug}`)
    }, 1750)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const match =
      suggestions[0] ||
      CITY_POINTS.find((c) => c.name.toLowerCase() === query.trim().toLowerCase())
    if (match) flyToCity(match)
  }

  const pointsData = useMemo(
    () => CITY_POINTS.map((c) => ({ ...c, size: 0.4, color: '#2DD4BF' })),
    []
  )

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#2DD4BF"
        atmosphereAltitude={0.22}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel={(d) => `<div style="font-family:Inter,sans-serif;color:#0B0F17;background:#2DD4BF;padding:3px 8px;border-radius:6px;font-size:12px;font-weight:600">${d.name}</div>`}
        onPointClick={(d) => flyToCity(d)}
      />

      {/* Floating glassmorphism search bar */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl px-4">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight whitespace-pre-line">
            {t('heroTitle')}
          </h1>
          <p className="text-mist-400 text-sm mt-2">{t('heroSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 shadow-panel">
            <Search size={18} className="text-teal-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              disabled={isFlying}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-mist-400 text-sm"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="absolute mt-2 w-full bg-base-900/95 backdrop-blur-md border border-base-600 rounded-xl overflow-hidden shadow-panel z-10">
              {suggestions.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => flyToCity(c)}
                  className="w-full text-left px-4 py-2.5 text-sm text-mist-200 hover:bg-teal-400/10 hover:text-teal-300 transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
