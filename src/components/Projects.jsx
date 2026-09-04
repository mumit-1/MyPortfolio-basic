import { useMemo } from 'react'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import Masonry from './ui/Masonry'
import { site } from '../data/site'
import { posterDataUri } from '../lib/poster'

// Staggered tile heights so the wall has rhythm (Masonry halves these).
const TILE_HEIGHTS = [1120, 1300, 1000]

/**
 * Work — a wall of generated blueprint posters (click a poster to open the
 * live build), then the index underneath carrying the full detail and both links
 * for each project. The wall is the visual; the index is the record.
 */
export default function Projects() {
  const tiles = useMemo(
    () =>
      site.projects.map((p, i) => ({
        id: p.name,
        img: posterDataUri({
          title: p.name,
          tagline: p.tagline,
          tags: p.tags,
          icon: p.icon,
          index: i,
        }),
        url: p.live,
        height: TILE_HEIGHTS[i] ?? 1120,
      })),
    [],
  )

  return (
    <Section id="work">
      <div className="mb-10 max-w-2xl">
        <BlurFade>
          <p className="eyebrow">work</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h2 className="mt-3 text-4xl sm:text-5xl">Things I&apos;ve shipped</h2>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mt-4 text-lg leading-relaxed text-soft">
            Three builds, all live. Tap a poster to open it, or read the detail below.
          </p>
        </BlurFade>
      </div>

      {/* poster wall — decorative shortcut to each live build; the index below is
          the keyboard-accessible source of truth for the same links */}
      

      <ul className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {site.projects.map((p, i) => (
          <li
            key={p.name}
            className={i === 0 ? '' : 'border-t border-[var(--border)]'}
          >
            <BlurFade delay={i * 0.06}>
              <article className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-start md:gap-10">
                <div className="md:flex-1">
                  <h3 className="text-xl sm:text-2xl">{p.name}</h3>
                  <p className="mt-1 font-term text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                    {p.tagline}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">{p.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-[var(--border)] px-2.5 py-1 font-term text-[0.7rem] uppercase tracking-[0.12em] text-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-grad inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-term text-xs uppercase tracking-[0.16em] text-[#050505] shadow-neon transition-shadow hover:shadow-neon-lg"
                  >
                    live <FiArrowUpRight />
                  </a>
                  <a
                    href={p.code}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 font-term text-xs uppercase tracking-[0.16em] text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <FiGithub /> code
                  </a>
                </div>
              </article>
            </BlurFade>
          </li>
        ))}
      </ul>
    </Section>
  )
}
