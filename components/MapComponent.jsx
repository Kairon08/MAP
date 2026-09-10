'use client'
import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { NEARBY_PLACES } from '../data/mockHotels'

function createPriceIcon(label, isActive, isFeatured) {
  const classes = ['price-marker']
  if (isActive) classes.push('active')
  if (isFeatured) classes.push('featured')
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div class="${classes.join(' ')}">${label}</div>`,
    iconSize: null,
    iconAnchor: [30, 18],
  })
}

function createPoiIcon(symbol) {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div class="poi-marker">${symbol}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

const POI_SYMBOL = { sight: '◆', restaurant: '◉', transport: '▣' }

function FlyToCity({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.9 })
  }, [center, zoom, map])
  return null
}

function formatPrice(hotel) {
  return `${hotel.currency}${hotel.price}`
}

export default function MapComponent({ hotels, city, selectedHotelId, onSelectHotel, showNeighborhood }) {
  const nearbyPlaces = useMemo(() => {
    if (!showNeighborhood || !selectedHotelId) return []
    return NEARBY_PLACES[selectedHotelId] || []
  }, [showNeighborhood, selectedHotelId])

  return (
    <MapContainer center={[city.lat, city.lng]} zoom={city.zoom} zoomControl={false} className="w-full h-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToCity center={[city.lat, city.lng]} zoom={city.zoom} />

      {hotels.map((hotel) => (
        <Marker
          key={hotel.id}
          position={[hotel.lat, hotel.lng]}
          icon={createPriceIcon(formatPrice(hotel), hotel.id === selectedHotelId, hotel.is_featured)}
          eventHandlers={{ click: () => onSelectHotel(hotel.id) }}
        />
      ))}

      {nearbyPlaces.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createPoiIcon(POI_SYMBOL[place.type] || '•')}
        />
      ))}
    </MapContainer>
  )
}
