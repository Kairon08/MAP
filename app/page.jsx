'use client'
import dynamic from 'next/dynamic'
import LanguageSwitcher from '../components/LanguageSwitcher'

// react-globe.gl WebGL/DOM ga bog'liq, shuning uchun server-side render
// qilinmasligi kerak — ssr: false shart.
const GlobeHero = dynamic(() => import('../components/GlobeHero'), { ssr: false })

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen bg-base-900 overflow-hidden">
      <LanguageSwitcher />
      <GlobeHero />
    </main>
  )
}
