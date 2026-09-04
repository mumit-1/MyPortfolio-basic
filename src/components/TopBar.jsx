import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { site } from '../data/site'
import { cn } from '../lib/cn'

/**
 * Minimal top bar: monogram wordmark plus the mobile menu (desktop navigation
 * is the left-side OptionWheel). Gains a blurred panel background once the page
 * scrolls.
 */
export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[60] transition-colors duration-300',
        scrolled ? 'panel border-b border-[var(--border)]' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="group flex items-center gap-3" aria-label="Home">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--card)] font-display text-sm font-extrabold text-[var(--fg)] shadow-neon">
            {site.monogram}
          </span>
          <span className="font-term text-xs uppercase tracking-[0.25em] text-soft transition-colors group-hover:text-[var(--fg)]">
            {site.name}
          </span>
        </a>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="panel overflow-hidden border-b border-[var(--border)] md:hidden"
          >
            <ul className="flex flex-col px-6 py-2">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-term text-sm uppercase tracking-[0.2em] text-soft transition-colors hover:text-[var(--fg)]"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
