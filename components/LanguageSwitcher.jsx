'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage, LANGUAGES } from '../lib/i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-base-900/70 backdrop-blur-md border border-base-600 rounded-full px-3 py-1.5 text-sm text-white hover:border-teal-400/60 transition-colors"
      >
        <span>{current.flag}</span>
        <span className="font-display font-medium text-xs">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-base-900/95 backdrop-blur-md border border-base-600 rounded-xl overflow-hidden shadow-panel"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  l.code === lang ? 'text-teal-300 bg-teal-400/10' : 'text-mist-200 hover:bg-base-800'
                }`}
              >
                <span>{l.flag}</span>
                <span className="font-display text-xs">{l.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
