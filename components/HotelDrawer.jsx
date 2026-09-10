'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Star, Wifi, Waves, Wine, Layers, ChevronLeft, ChevronRight, ExternalLink, BadgeCheck } from 'lucide-react'
import { useLanguage } from '../lib/i18n'

export default function HotelDrawer({ hotel, onClose, showNeighborhood, onToggleNeighborhood }) {
  const [activeImage, setActiveImage] = useState(0)
  const { t } = useLanguage()

  if (!hotel) return null

  function nextImage() {
    setActiveImage((i) => (i + 1) % hotel.images.length)
  }
  function prevImage() {
    setActiveImage((i) => (i - 1 + hotel.images.length) % hotel.images.length)
  }

  const reviews = hotel.reviews || []

  return (
    <AnimatePresence>
      <motion.aside
        key={hotel.id}
        initial={{ x: '100%', opacity: 0.4 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-base-900/95 backdrop-blur-xl border-l border-base-700 shadow-panel z-40 flex flex-col"
      >
        <div className="relative h-64 shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={hotel.images[activeImage]}
              alt={hotel.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-transparent to-transparent" />

          {hotel.is_featured && (
            <span className="absolute top-4 left-4 flex items-center gap-1 bg-coral-400/15 border border-coral-400 text-coral-400 text-xs font-medium px-2.5 py-1 rounded-full shadow-coralGlow">
              <BadgeCheck size={13} /> {t('featured')}
            </span>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-base-950/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-base-950 transition-colors"
          >
            <X size={16} />
          </button>

          {hotel.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-base-950/60 flex items-center justify-center text-white hover:bg-base-950 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-base-950/60 flex items-center justify-center text-white hover:bg-base-950 transition-colors">
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {hotel.images.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImage ? 'bg-teal-400' : 'bg-white/30'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-white leading-snug">{hotel.name}</h2>
            <div className="shrink-0 flex items-center gap-1 bg-base-800 border border-base-600 rounded-lg px-2 py-1">
              <Star size={13} fill="#2DD4BF" className="text-teal-400" />
              <span className="text-sm font-medium text-white">{hotel.rating}</span>
            </div>
          </div>
          <p className="text-xs text-mist-400 mt-1">{reviews.length} {t('reviews')}</p>

          <p className="text-sm text-mist-200 leading-relaxed mt-4">{hotel.description}</p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {hotel.wifi && <span className="flex items-center gap-1.5 text-xs text-teal-300 bg-teal-400/10 border border-teal-400/30 rounded-full px-3 py-1.5"><Wifi size={13} /> {t('wifi')}</span>}
            {hotel.pool && <span className="flex items-center gap-1.5 text-xs text-teal-300 bg-teal-400/10 border border-teal-400/30 rounded-full px-3 py-1.5"><Waves size={13} /> {t('pool')}</span>}
            {hotel.bar && <span className="flex items-center gap-1.5 text-xs text-teal-300 bg-teal-400/10 border border-teal-400/30 rounded-full px-3 py-1.5"><Wine size={13} /> {t('bar')}</span>}
          </div>

          <button
            onClick={onToggleNeighborhood}
            className={`w-full flex items-center justify-center gap-2 mt-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              showNeighborhood ? 'bg-coral-400/10 border-coral-400 text-coral-400' : 'bg-base-800 border-base-600 text-mist-200 hover:border-base-500'
            }`}
          >
            <Layers size={15} />
            {showNeighborhood ? t('hideNeighborhood') : t('showNeighborhood')}
          </button>

          <div className="mt-6">
            <p className="text-sm font-medium text-white mb-3">{t('reviewsTitle')}</p>
            <div className="flex flex-col gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="bg-base-800/60 border border-base-700 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white font-medium">{r.author}</span>
                    <div className="flex items-center gap-1">
                      <Star size={11} fill="#2DD4BF" className="text-teal-400" />
                      <span className="text-xs text-mist-200">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-mist-400 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - narx, band qilish va affiliate havola */}
        <div className="shrink-0 border-t border-base-700 px-6 py-4 bg-base-900/95">
          {hotel.is_featured && (
            <p className="text-[11px] text-mist-400 mb-2">{t('sponsoredNote')}</p>
          )}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-mist-400">{t('perNight')}</p>
              <p className="font-display text-lg font-semibold text-white">{hotel.currency}{hotel.price}</p>
            </div>
            <a
              href={hotel.affiliate_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-1.5 bg-teal-400 hover:bg-teal-300 transition-colors text-base-950 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-glow"
            >
              {t('bookVia')}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
