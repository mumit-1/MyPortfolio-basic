import { FiArrowUp } from 'react-icons/fi'
import { site } from '../data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[var(--border)] px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--fg)]">
            {site.name}
          </p>
          <p className="mt-1.5 font-term text-xs uppercase tracking-[0.16em] text-soft">
            © {year} · built with react, tailwind &amp; no colour at all
          </p>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 font-term text-xs uppercase tracking-[0.16em] text-soft transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <FiArrowUp className="transition-transform group-hover:-translate-y-0.5" />
          back to top
        </a>
      </div>
    </footer>
  )
}
