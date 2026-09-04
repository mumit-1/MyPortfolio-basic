import { cn } from '../../lib/cn'

/**
 * CRT atmosphere overlay: static scanlines + a slow light sweep + edge vignette.
 * Fixed, non-interactive, and theme-scaled via --scan-opacity (near-off in light).
 * The sweep is a CSS animation, so reduced-motion freezes it to a still frame.
 */
export default function Scanlines({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 z-[40]',
        className,
      )}
    >
      {/* horizontal scanlines */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 'var(--scan-opacity)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* slow vertical sheen sweep */}
      <div
        className="absolute inset-0 animate-scan opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent 0%, var(--glow) 45%, transparent 90%)',
          backgroundSize: '100% 220vh',
          mixBlendMode: 'screen',
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)',
        }}
      />
    </div>
  )
}
