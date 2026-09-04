import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * Masonry (React Bits) — a measured, gsap-positioned grid that blurs/slides its
 * tiles into place, then tweens on layout changes. Ported verbatim except:
 *   - under prefers-reduced-motion the intro is skipped (tiles are placed
 *     instantly), matching the site-wide motion policy.
 * Feed items as { id, img, url, height }. Parent must be relative + sized.
 */
const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue
    return values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue
  }

  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get)
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler))
    return () => queries.forEach((q) => matchMedia(q).removeEventListener('change', handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries])

  return value
}

const useMeasure = () => {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        }),
    ),
  )
}

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [3, 3, 2, 2],
    1,
  )

  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(false)

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right']
      direction = dirs[Math.floor(Math.random() * dirs.length)]
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true))
  }, [items])

  const grid = useMemo(() => {
    if (!width) return []
    const colHeights = new Array(columns).fill(0)
    const gap = 16
    const totalGaps = (columns - 1) * gap
    const columnWidth = (width - totalGaps) / columns

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = col * (columnWidth + gap)
      const height = child.height / 2
      const y = colHeights[col]

      colHeights[col] += height + gap
      return { ...child, x, y, w: columnWidth, h: height }
    })
  }, [columns, items, width])

  const containerHeight = useMemo(() => {
    if (!grid.length) return 0
    return Math.max(...grid.map((g) => g.y + g.h))
  }, [grid])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        if (prefersReduced) {
          gsap.set(selector, { opacity: 1, ...animProps })
        } else {
          const start = getInitialPosition(item)
          gsap.fromTo(
            selector,
            {
              opacity: 0,
              x: start.x,
              y: start.y,
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: 'blur(10px)' }),
            },
            {
              opacity: 1,
              ...animProps,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.8,
              ease: 'power3.out',
              delay: index * stagger,
            },
          )
        }
      } else {
        gsap.to(selector, {
          ...animProps,
          duration: prefersReduced ? 0 : duration,
          ease,
          overwrite: 'auto',
        })
      }
    })

    hasMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const handleMouseEnter = (id, element) => {
    if (scaleOnHover && !prefersReduced) {
      gsap.to(`[data-key="${id}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 })
    }
  }

  const handleMouseLeave = (id, element) => {
    if (scaleOnHover && !prefersReduced) {
      gsap.to(`[data-key="${id}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
    }
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: containerHeight || undefined }}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{ willChange: 'transform, width, height, opacity' }}
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-[14px] border bg-cover bg-center shadow-[0_18px_50px_-18px_rgba(0,0,0,0.65)]"
            style={{ backgroundImage: `url(${item.img})`, borderColor: 'var(--border)' }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay bg-grad-soft pointer-events-none absolute inset-0 rounded-[14px] opacity-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Masonry
