import { useCallback, useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

const morphTime = 1.5
const cooldownTime = 0.5

function useMorphingText(texts, enabled, isMobile) {  // <-- add isMobile param
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)

  const setStyles = useCallback(
    (fraction) => {
      const current1 = text1Ref.current
      const current2 = text2Ref.current
      if (!current1 || !current2) return

      if (isMobile) {
        // cheap version: opacity only, no blur
        current2.style.opacity = `${fraction * 100}%`
        const inv = 1 - fraction
        current1.style.opacity = `${inv * 100}%`
        current1.textContent = texts[textIndexRef.current % texts.length]
        current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
      } else {
        // original blur version
        current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
        current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
        const inv = 1 - fraction
        current1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
        current1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`
        current1.textContent = texts[textIndexRef.current % texts.length]
        current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
      }
    },
    [texts, isMobile], // <-- add isMobile here
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0
    let fraction = morphRef.current / morphTime
    if (fraction > 1) {
      cooldownRef.current = cooldownTime
      fraction = 1
    }
    setStyles(fraction)
    if (fraction === 1) textIndexRef.current++
  }, [setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const current1 = text1Ref.current
    const current2 = text2Ref.current
    if (current1 && current2) {
      current2.style.filter = 'none'
      current2.style.opacity = '100%'
      current1.style.filter = 'none'
      current1.style.opacity = '0%'
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    let raf
    timeRef.current = new Date()
    morphRef.current = 0
    cooldownRef.current = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const now = new Date()
      const dt = (now - timeRef.current) / 1000
      timeRef.current = now
      cooldownRef.current -= dt
      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [enabled, doMorph, doCooldown])

  return { text1Ref, text2Ref }
}

const SvgFilters = () => (
  <svg aria-hidden className="fixed h-0 w-0">
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export default function MorphingText({ texts, className }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // add this: detect mobile
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 640px)').matches

  const { text1Ref, text2Ref } = useMorphingText(texts, !reduced, isMobile) // <-- pass isMobile

  if (reduced) {
    return (
      <div className={cn('relative mx-auto h-14 w-full text-center', className)}>
        {texts[0]}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative mx-auto h-14 w-full text-center',
        !isMobile && '[filter:url(#threshold)_blur(0.6px)]', // <-- skip SVG filter on mobile
        className,
      )}
    >
      <span
        ref={text1Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full will-change-[opacity,filter]"
      />
      <span
        ref={text2Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full will-change-[opacity,filter]"
      />
      {!isMobile && <SvgFilters />}
    </div>
  )
}