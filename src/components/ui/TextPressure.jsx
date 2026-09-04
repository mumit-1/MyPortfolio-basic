import { useCallback, useEffect, useRef, useState } from 'react'

// Where the virtual cursor rests when the pointer is away, expressed as a
// multiple of the falloff radius. Anything >= 1 already yields the minimum axis
// value on every glyph, so the only job of the extra margin is to keep the rest
// state unambiguous. Parking at a literal ±100000 instead would be a trap: the
// lerp closes 1/15 of the gap per frame, so easing back in from that far out
// takes hundreds of frames and the text never appears to react at all.
const PARK_FACTOR = 1.75

/**
 * Text Pressure (React Bits) — each glyph's variable-font axes respond to the
 * cursor's distance. Rewritten falloff: the text rests at the *minimum* of every
 * axis (hairline, condensed) and only thickens where the pointer actually is,
 * then relaxes back to thin when the pointer leaves the window.
 *
 * Axis ranges must match the font. Defaults are Archivo's real axes
 * (wght 100..900, wdth 62..125) — a font without a 100 weight cannot go thin.
 * Container must have an explicit size.
 */
export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'Archivo',
  fontUrl = '',
  width = true,
  weight = true,
  italic = false,
  alpha = false,
  flex = true,
  textColor = 'var(--fg)',
  minFontSize = 40,
  // Average glyph advance as a fraction of the font size. Upstream assumes 0.5;
  // wide display faces need more headroom or the line overflows and gets clipped.
  charWidthRatio = 0.5,
  // Axis bounds as primitives (not tuples) so the animation effect's deps stay
  // referentially stable across renders.
  minWeight = 100,
  maxWeight = 900,
  minWidth = 62,
  maxWidth = 125,
  minAlpha = 0.35,
  // >1 tightens the cursor's halo so thickening reads as local pressure rather
  // than the whole word swelling at once.
  falloff = 1.6,
  className = '',
}) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const spansRef = useRef([])

  // mouseRef is the eased "virtual" cursor the glyphs actually read; cursorRef is
  // the raw target it chases. parkedRef says the pointer is away, in which case
  // the target is resolved per-frame from the title's own box (see PARK_FACTOR).
  const mouseRef = useRef(null)
  const cursorRef = useRef({ x: 0, y: 0 })
  const parkedRef = useRef(true)

  const [fontSize, setFontSize] = useState(minFontSize)
  const chars = text.split('')

  useEffect(() => {
    const moveTo = (x, y) => {
      cursorRef.current.x = x
      cursorRef.current.y = y
      // Coming out of rest, snap rather than ease: the pointer is already where
      // the user put it, so a visible catch-up would just read as lag.
      if (parkedRef.current) {
        mouseRef.current = { x, y }
        parkedRef.current = false
      }
    }

    const handleMouse = (e) => moveTo(e.clientX, e.clientY)
    const handleTouch = (e) => {
      const t = e.touches[0]
      if (t) moveTo(t.clientX, t.clientY)
    }
    // Pointer gone: ease back out to the resting hairline and re-arm the snap so
    // the next entry is immediate again.
    const handleLeave = () => {
      parkedRef.current = true
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('touchend', handleLeave)
    document.addEventListener('mouseleave', handleLeave)
    window.addEventListener('blur', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchend', handleLeave)
      document.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('blur', handleLeave)
    }
  }, [])

  const setSize = useCallback(() => {
    if (!containerRef.current) return
    const { width: cw } = containerRef.current.getBoundingClientRect()
    if (!cw) return
    setFontSize(Math.max(cw / (chars.length * charWidthRatio), minFontSize))
  }, [chars.length, minFontSize, charWidthRatio])

  useEffect(() => {
    setSize()
    window.addEventListener('resize', setSize)

    // The window-resize listener alone isn't enough: if the container measures 0
    // at mount (hidden tab, late layout) the size would stay stuck at
    // minFontSize forever. Watch the box, and re-fit once the webfont lands
    // since the fit depends on the face's metrics.
    const el = containerRef.current
    const ro = el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => setSize()) : null
    if (ro && el) ro.observe(el)
    if (document.fonts?.ready) document.fonts.ready.then(setSize).catch(() => {})

    return () => {
      window.removeEventListener('resize', setSize)
      if (ro) ro.disconnect()
    }
  }, [setSize])

  useEffect(() => {
    let raf
    const animate = () => {
      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect()
        const maxDist = titleRect.width / 2 || 1

        // Resolve the target. At rest that's a point straight above the title,
        // one falloff radius clear of it — far enough that every glyph reads its
        // minimum, close enough that easing back in takes a fraction of a second.
        const target = parkedRef.current
          ? {
              x: titleRect.x + titleRect.width / 2,
              y: titleRect.y + titleRect.height / 2 - maxDist * PARK_FACTOR,
            }
          : cursorRef.current

        // First frame (or first frame after a resize while parked): start at the
        // target rather than easing in from an arbitrary origin.
        if (!mouseRef.current) mouseRef.current = { ...target }

        mouseRef.current.x += (target.x - mouseRef.current.x) / 15
        mouseRef.current.y += (target.y - mouseRef.current.y) / 15

        spansRef.current.forEach((span) => {
          if (!span) return
          const rect = span.getBoundingClientRect()
          const dx = rect.x + rect.width / 2 - mouseRef.current.x
          const dy = rect.y + rect.height / 2 - mouseRef.current.y
          const d = Math.sqrt(dx * dx + dy * dy)

          // 1 right under the cursor, 0 at maxDist and beyond.
          const t = Math.pow(Math.max(0, 1 - d / maxDist), falloff)
          const axis = (min, max) => min + (max - min) * t

          const wght = Math.round(weight ? axis(minWeight, maxWeight) : minWeight)
          const wdth = Math.round(width ? axis(minWidth, maxWidth) : minWidth)
          const ital = (italic ? axis(0, 1) : 0).toFixed(2)

          span.style.opacity = alpha ? axis(minAlpha, 1).toFixed(2) : 1
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`
        })
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [width, weight, italic, alpha, minWeight, maxWeight, minWidth, maxWidth, minAlpha, falloff])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    >
      {fontUrl ? (
        <style>{`@font-face{font-family:'${fontFamily}';src:url('${fontUrl}');font-style:normal;}`}</style>
      ) : null}
      <h1
        ref={titleRef}
        className={`${flex ? 'flex justify-between' : ''} ${className}`}
        style={{
          fontFamily,
          fontSize,
          lineHeight: 1,
          margin: 0,
          // Start at the resting axis values so the first paint is already thin
          // — the rAF loop then overrides each span individually.
          fontWeight: minWeight,
          fontVariationSettings: `'wght' ${minWeight}, 'wdth' ${minWidth}`,
          color: textColor,
          textTransform: 'uppercase',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </h1>
    </div>
  )
}
