import { cn } from '../../lib/cn'

/**
 * Progressive (gradual) blur band for blending section edges — layered
 * backdrop-filters with stepped masks so the blur ramps smoothly instead of a
 * hard cut. Non-interactive. Place inside a positioned parent (target='parent')
 * or pin to the viewport edge (target='page').
 *
 * Ported from React Bits "Gradual Blur" (no external deps).
 */
export default function GradualBlur({
  position = 'bottom',
  height = '7rem',
  strength = 2,
  divCount = 6,
  target = 'parent',
  zIndex = 20,
  className,
}) {
  const increment = 100 / divCount
  const dir = position === 'top' ? 'to top' : 'to bottom'

  const layers = Array.from({ length: divCount }).map((_, i) => {
    const blur = (i + 1) * 0.5 * strength
    const p0 = increment * (i - 1)
    const p1 = increment * i
    const p2 = increment * (i + 1)
    const p3 = increment * (i + 2)
    const mask = `linear-gradient(${dir}, rgba(0,0,0,0) ${p0}%, rgba(0,0,0,1) ${p1}%, rgba(0,0,0,1) ${p2}%, rgba(0,0,0,0) ${p3}%)`
    return (
      <div
        key={i}
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    )
  })

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none left-0 right-0', className)}
      style={{
        position: target === 'page' ? 'fixed' : 'absolute',
        [position]: 0,
        height,
        zIndex,
      }}
    >
      {layers}
    </div>
  )
}
