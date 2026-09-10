'use client'
import { Wifi, Waves, Wine, Star } from 'lucide-react'
import { useLanguage } from '../lib/i18n'

const QUICK_TOGGLES = [
  { key: 'wifi', icon: Wifi },
  { key: 'pool', icon: Waves },
  { key: 'bar', icon: Wine },
]

export default function FilterSidebar({ cityName, filters, onFilterChange, resultsCount }) {
  const { t } = useLanguage()

  function toggle(key) {
    onFilterChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <aside className="w-full h-full overflow-y-auto thin-scroll bg-base-900/80 backdrop-blur-xl border-r border-base-700 p-5 flex flex-col gap-6">
      <div>
        <p className="font-display text-lg font-semibold tracking-tight text-white">Voyage</p>
        <p className="text-xs text-mist-400 mt-0.5">{cityName}</p>
      </div>

      <div>
        <div className="flex justify-between text-xs text-mist-400 mb-2">
          <span>{t('filterPrice')}</span>
          <span className="text-teal-300 font-medium">
            {filters.maxPrice} {t('filterUpTo')}
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={500}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-teal-400"
        />
      </div>

      <div>
        <label className="text-xs text-mist-400 mb-2 block">{t('filterRating')}</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange({ ...filters, minRating: r })}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                filters.minRating === r
                  ? 'bg-teal-400 text-base-950 border-teal-400'
                  : 'bg-base-800 text-mist-200 border-base-600 hover:border-teal-400/50'
              }`}
            >
              {r === 0 ? t('filterAll') : (
                <>
                  <Star size={12} fill="currentColor" className={filters.minRating === r ? '' : 'text-mist-400'} />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-mist-400 mb-2 block">{t('amenities')}</label>
        <div className="flex flex-col gap-2">
          {QUICK_TOGGLES.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                filters[key]
                  ? 'bg-teal-400/10 border-teal-400 text-teal-300'
                  : 'bg-base-800 border-base-600 text-mist-200 hover:border-base-500'
              }`}
            >
              <Icon size={16} />
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-base-700 text-xs text-mist-400">
        <span className="text-teal-300 font-semibold">{resultsCount}</span> {t('resultsFound')}
      </div>
    </aside>
  )
}
