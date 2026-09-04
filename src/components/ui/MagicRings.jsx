import { cn } from '../../lib/cn'

/**
 * Concentric glowing rings + a soft core — the halo that sits behind the hero
 * name. Decorative only. Spin/pulse are CSS animations, so they freeze under
 * prefers-reduced-motion.
 */
export default function MagicRings({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className,
      )}
    >
      {/* glowing core — low-alpha white, not solid: a full-strength white blob
          here would wash out the hairline name sitting in front of it */}
      <div
        className="absolute h-[46%] w-[46%] rounded-full blur-3xl animate-pulse-glow"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.16), transparent 65%)',
        }}
      />

      {/* static rings */}
      {[38, 54, 72, 92].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            border: '1px solid var(--border)',
            boxShadow: `0 0 ${20 + i * 6}px -8px var(--glow)`,
            opacity: 0.6 - i * 0.1,
          }}
        />
      ))}

      {/* one slow-spinning dashed ring for life */}
      <div
        className="absolute h-[64%] w-[64%] rounded-full animate-spin-slow"
        style={{
          border: '1px dashed var(--accent)',
          opacity: 0.22,
        }}
      />
    </div>
  )
}
