import { cn } from '../../lib/cn'

/**
 * A light-beam that slides across — the "divider that isn't a plain line".
 * The streak is a moving gradient (freezes under reduced-motion via the global
 * guard); a blurred copy underneath gives it bloom.
 */
export default function BeamDivider({ className }) {
  const beam = {
    background: 'linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--accent-2) 60%, transparent 100%)',
    backgroundSize: '200% 100%',
  }
  return (
    <div aria-hidden className={cn('relative mx-auto h-px w-full max-w-6xl', className)}>
      <div className="animate-beam-run h-px w-full opacity-70" style={beam} />
      <div className="animate-beam-run absolute inset-x-0 top-0 h-px opacity-80 blur-[3px]" style={beam} />
    </div>
  )
}
