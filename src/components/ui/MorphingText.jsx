import { useCallback, useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * Morphing Text (MagicUI) — crossfades a list of strings with a gooey blur
 * threshold. Ported TS→JSX: cn from local lib, v3 arbitrary filter class.
 * Falls back to a static first label under prefers-reduced-motion.
 */

const morphTime = 1.5
const cooldownTime = 0.5

function useMorphingText(texts, enabled) {
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
      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
      const inv = 1 - fraction
      current1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
      current1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`
      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
    },
    [texts],
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
    // reset the delta clock on (re)start so the first frame's dt is tiny
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

  const { text1Ref, text2Ref } = useMorphingText(texts, !reduced)

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
        'relative mx-auto h-14 w-full text-center [filter:url(#threshold)_blur(0.6px)]',
        className,
      )}
    >
      <span
        ref={text1Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
      />
      <span
        ref={text2Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
      />
      <SvgFilters />
    </div>
  )
}
