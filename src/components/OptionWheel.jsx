import { site } from '../data/site'
import { useActiveSection } from '../lib/useActiveSection'
import { cn } from '../lib/cn'

/**
 * Option Wheel — the left-side section navigator (desktop). Dots sit on a gentle
 * arc; the active section (scroll-spy) lights up and reveals its label.
 * Hidden on mobile, where the TopBar menu takes over.
 */
const items = [{ label: 'home', href: '#top' }, ...site.nav]
const ids = items.map((i) => i.href.slice(1))

export default function OptionWheel() {
  const active = useActiveSection(ids)
  const n = items.length

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-5 top-1/2 z-[55] hidden -translate-y-1/2 md:block"
    >
      <span
        aria-hidden
        className="absolute left-[6px] top-2 -z-10 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent"
      />
      <ul className="flex flex-col gap-5">
        {items.map((item, i) => {
          const id = item.href.slice(1)
          const isActive = active === id
          const bump = Math.sin((i / (n - 1)) * Math.PI) * 12
          return (
            <li key={item.href} style={{ transform: `translateX(${bump}px)` }}>
              <a
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    'relative grid h-3.5 w-3.5 place-items-center rounded-full border transition-all duration-300',
                    isActive
                      ? 'border-[var(--accent-2)] bg-[var(--accent)] shadow-neon'
                      : 'border-[var(--muted)] group-hover:border-[var(--accent)]',
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                  )}
                </span>
                <span
                  className={cn(
                    'font-term text-xs uppercase tracking-[0.22em] transition-all duration-300',
                    isActive
                      ? 'translate-x-0 text-[var(--fg)] opacity-100'
                      : '-translate-x-1 text-soft opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
