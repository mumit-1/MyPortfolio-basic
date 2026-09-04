import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * Glyph Matrix (MagicUI) — a canvas grid of faint mono glyphs that randomly
 * mutate, like a booting terminal. Ported TS→JSX. Color is theme-passed and
 * resolved to RGBA via a probe canvas. rAF + ResizeObserver, both cleaned up.
 * Parent must have an explicit size.
 */
export default function GlyphMatrix({
  glyphs = '01·•+*/\\<>=x',
  cellSize = 14,
  mutationRate = 0.05,
  interval = 90,
  fadeBottom = 0.6,
  color = '#ffffff',
  className,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resolve the requested color to RGBA components once.
    let r = 46
    let g = 107
    let b = 255
    let aBase = 1
    try {
      const probe = document.createElement('canvas')
      probe.width = probe.height = 1
      const pctx = probe.getContext('2d')
      pctx.fillStyle = color
      pctx.fillRect(0, 0, 1, 1)
      const d = pctx.getImageData(0, 0, 1, 1).data
      r = d[0]
      g = d[1]
      b = d[2]
      aBase = d[3] / 255
    } catch {
      /* keep defaults */
    }

    const glyphArr = glyphs.split('')
    const rand = (n) => Math.floor(Math.random() * n)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let raf = 0
    let cols = 0
    let rows = 0
    let cells = []
    let alphas = []
    let last = 0

    const draw = (w, h) => {
      ctx.clearRect(0, 0, w, h)
      for (let y = 0; y < rows; y++) {
        const fade = 1 - (y / rows) * fadeBottom
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x
          const a = alphas[idx] * fade * aBase
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`
          ctx.fillText(glyphArr[cells[idx]], x * cellSize, y * cellSize)
        }
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(1, Math.floor(w / cellSize))
      rows = Math.max(1, Math.floor(h / cellSize))
      const total = cols * rows
      cells = new Array(total)
      alphas = new Array(total)
      for (let i = 0; i < total; i++) {
        cells[i] = rand(glyphArr.length)
        alphas[i] = 0.05 + Math.random() * 0.35
      }
      ctx.font = `${cellSize - 3}px 'Share Tech Mono', ui-monospace, monospace`
      ctx.textBaseline = 'top'
      draw(w, h)
    }

    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      if (t - last < interval) return
      last = t
      const total = cols * rows
      const mutations = Math.max(1, Math.floor(total * mutationRate))
      for (let m = 0; m < mutations; m++) {
        const i = rand(total)
        cells[i] = rand(glyphArr.length)
        alphas[i] = 0.05 + Math.random() * 0.35
      }
      const rect = canvas.getBoundingClientRect()
      draw(Math.floor(rect.width), Math.floor(rect.height))
    }

    resize()
    raf = requestAnimationFrame(tick)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom, color])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none block h-full w-full', className)}
    />
  )
}
