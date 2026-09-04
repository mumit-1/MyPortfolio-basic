import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import { site } from '../data/site'

/**
 * Education, as a terminal read-out — the retro register the rest of the page
 * uses for utility text, taken literally for one card.
 */
export default function Education() {
  const { school, degree, period, location, note } = site.education

  return (
    <Section id="education">
      <div className="mb-10 max-w-2xl">
        <BlurFade>
          <p className="eyebrow">education</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h2 className="mt-3 text-4xl sm:text-5xl">Where I&apos;m studying</h2>
        </BlurFade>
      </div>

      <BlurFade delay={0.12}>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-neon">
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--muted)] opacity-50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--muted)] opacity-50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            </span>
            <p className="font-term text-xs uppercase tracking-[0.2em] text-soft">
              mumit@brac — ~/education
            </p>
          </div>

          <div className="space-y-4 p-6 font-term text-sm leading-relaxed sm:p-8 sm:text-base">
            <p className="text-soft">
              <span className="text-[var(--accent)]">$</span> cat degree.txt
            </p>

            <div className="space-y-1.5">
              <p className="font-display text-lg font-extrabold uppercase tracking-[0.08em] text-[var(--fg)] sm:text-xl">
                {school}
              </p>
              <p className="text-[var(--fg)]">{degree}</p>
              <p className="text-soft">
                {period} · {location}
              </p>
            </div>

            <p className="text-soft">
              <span className="text-[var(--accent)]">$</span> cat notes.txt
            </p>
            <p className="max-w-2xl text-soft">{note}</p>

            <p className="text-[var(--accent)]">
              $<span className="animate-blink ml-1.5 inline-block">_</span>
            </p>
          </div>
        </div>
      </BlurFade>
    </Section>
  )
}
