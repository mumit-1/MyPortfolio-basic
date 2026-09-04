import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TopBar from './components/TopBar'
import OptionWheel from './components/OptionWheel'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Playground from './components/Playground'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SplashCursor from './components/ui/SplashCursor'
import Scanlines from './components/ui/Scanlines'
import GradualBlur from './components/ui/GradualBlur'
import BeamDivider from './components/ui/BeamDivider'
import { useMediaQuery } from './lib/useMediaQuery'

export default function App() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  // The fluid cursor is a full-screen WebGL sim — desktop mice only.
  const wantsSplash = useMediaQuery('(pointer: fine) and (min-width: 1024px)')

  // Skip the boot sequence entirely for reduced-motion users (no flash).
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [loading])

  return (
    <>
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>

      {!reduced && wantsSplash && <SplashCursor />}
      {/* <Scanlines /> */}

      <TopBar />
      <OptionWheel 
        items={['Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave']}
  defaultSelected={2}
  textColor="#a6a6a6"
  activeColor="#ffffff"
  side="left"
  fontSize={3}
  spacing={1.4}
  curve={1}
  tilt={6}
  blur={2}
  fade={0.25}
  smoothing={200}
  inset={80}
  loop={false}
  draggable
  soundUrl="/assets/sounds/click-soft.mp3"
  soundVolume={0.5}
  onChange={(index, item) => console.log(index, item)}
      />

      <main>
        <Hero ready={!loading} />
        <About />
        <BeamDivider />
        <Skills />
        <BeamDivider />
        <Projects />
        <BeamDivider />
        <Playground />
        <BeamDivider />
        <Education />
        <Contact />
      </main>

      <Footer />

      {/* content melts as it passes under the top bar */}
      <GradualBlur position="top" target="page" height="5rem" strength={1.6} divCount={6} zIndex={45} />
    </>
  )
}
