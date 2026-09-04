import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * Pixel Card (React Bits) — a canvas of pixels that shimmer in on hover/focus.
 * Ported with theme tweaks: variants are three tones of the monochrome ramp,
 * flexible
 * sizing (fills its parent; size it from the caller), and a token-driven
 * border. Honors prefers-reduced-motion via getEffectiveSpeed → 0.
 */
class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    this.sizeStep = Math.random() * 0.4
    this.minSize = 0.5
    this.maxSizeInteger = 2
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }
    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }
    this.draw()
  }

  disappear() {
    this.isShimmer = false
    this.counter = 0
    if (this.size <= 0) {
      this.isIdle = true
      return
    } else {
      this.size -= 0.1
    }
    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }
    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0
  const max = 100
  const throttle = 0.001
  const parsed = parseInt(value, 10)

  if (parsed <= min || reducedMotion) {
    return min
  } else if (parsed >= max) {
    return max * throttle
  } else {
    return parsed * throttle
  }
}

const VARIANTS = {
  default: {
    gap: 5,
    speed: 35,
    colors: '#f5f5f5,#8f8f8f,#2a2a2a',
    noFocus: false,
  },
  neon: {
    gap: 6,
    speed: 40,
    colors: '#ffffff,#bdbdbd,#5e5e5e',
    noFocus: false,
  },
  ice: {
    gap: 5,
    speed: 30,
    colors: '#ffffff,#dcdcdc,#8f8f8f',
    noFocus: false,
  },
}

export default function PixelCard({
  variant = 'neon',
  gap,
  speed,
  colors,
  noFocus,
  // When the card wraps its own link/button, drop the card's tab stop so keyboards
  // get one target instead of two — focus still bubbles up and triggers the pixels.
  tabbable = true,
  className = '',
  children,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const pixelsRef = useRef([])
  const animationRef = useRef(null)
  const timePreviousRef = useRef(performance.now())
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  const variantCfg = VARIANTS[variant] || VARIANTS.neon
  const finalGap = gap ?? variantCfg.gap
  const finalSpeed = speed ?? variantCfg.speed
  const finalColors = colors ?? variantCfg.colors
  const finalNoFocus = noFocus ?? variantCfg.noFocus

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)
    const ctx = canvasRef.current.getContext('2d')

    canvasRef.current.width = width
    canvasRef.current.height = height
    canvasRef.current.style.width = `${width}px`
    canvasRef.current.style.height = `${height}px`

    const colorsArray = finalColors.split(',')
    const pxs = []
    for (let x = 0; x < width; x += parseInt(finalGap, 10)) {
      for (let y = 0; y < height; y += parseInt(finalGap, 10)) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)]

        const dx = x - width / 2
        const dy = y - height / 2
        const distance = Math.sqrt(dx * dx + dy * dy)
        const delay = reducedMotion ? 0 : distance

        pxs.push(new Pixel(canvasRef.current, ctx, x, y, color, getEffectiveSpeed(finalSpeed, reducedMotion), delay))
      }
    }
    pixelsRef.current = pxs
  }

  const doAnimate = (fnName) => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName))
    const timeNow = performance.now()
    const timePassed = timeNow - timePreviousRef.current
    const timeInterval = 1000 / 60

    if (timePassed < timeInterval) return
    timePreviousRef.current = timeNow - (timePassed % timeInterval)

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    let allIdle = true
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i]
      pixel[fnName]()
      if (!pixel.isIdle) {
        allIdle = false
      }
    }
    if (allIdle) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleAnimation = (name) => {
    cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(() => doAnimate(name))
  }

  const onMouseEnter = () => handleAnimation('appear')
  const onMouseLeave = () => handleAnimation('disappear')
  const onFocus = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    handleAnimation('appear')
  }
  const onBlur = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    handleAnimation('disappear')
  }

  useEffect(() => {
    initPixels()
    const observer = new ResizeObserver(() => {
      initPixels()
    })
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalGap, finalSpeed, finalColors, finalNoFocus])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative isolate grid h-full w-full select-none place-items-center overflow-hidden rounded-2xl border transition-colors duration-200',
        className,
      )}
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocus}
      onBlur={finalNoFocus ? undefined : onBlur}
      tabIndex={tabbable && !finalNoFocus ? 0 : -1}
    >
      <canvas className="absolute inset-0 h-full w-full" ref={canvasRef} />
      {children}
    </div>
  )
}
