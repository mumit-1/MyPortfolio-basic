import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import PixelCard from './ui/PixelCard'
import DecryptedText from './ui/DecryptedText'
import { site } from '../data/site'

/**
 * About — the photo sits under a pixel field that shimmers in on hover, next to
 * a heading that decrypts as it scrolls into view.
 */
export default function About() {
  return (
    <Section id="about" grid>
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-14">
        {/* photo */}
        <BlurFade className="md:col-span-5">
          <div className="relative">
            <PixelCard variant="ice" tabbable={false} className="aspect-[4/5] h-auto w-full">
              <img
                src={site.photo}
                alt={`${site.name}, ${site.role}`}
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent p-5 pt-16">
                <p className="font-term text-xs uppercase tracking-[0.24em] text-[var(--accent-2)]">
                  {site.location}
                </p>
              </div>
            </PixelCard>

            {/* blueprint corner ticks */}
            <span aria-hidden className="absolute -left-2 -top-2 h-6 w-6 border-l border-t border-[var(--accent)]" />
            <span aria-hidden className="absolute -bottom-2 -right-2 h-6 w-6 border-b border-r border-[var(--accent)]" />
          </div>
        </BlurFade>

        {/* copy */}
        <div className="md:col-span-7">
          <BlurFade>
            <p className="eyebrow">about</p>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h2 className="mt-3 text-4xl sm:text-5xl">
              <DecryptedText
                text="Who's behind it"
                animateOn="view"
                speed={38}
                maxIterations={12}
                className="text-[var(--fg)]"
                encryptedClassName="text-[var(--accent)] opacity-70"
              />
            </h2>
          </BlurFade>

          <div className="mt-6 space-y-4">
            {site.about.body.map((para, i) => (
              <BlurFade key={i} delay={0.1 + i * 0.06}>
                <p className="text-base leading-relaxed text-soft sm:text-lg">{para}</p>
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.3}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {site.about.facts.map((fact) => (
                <li
                  key={fact}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-term text-xs uppercase tracking-[0.14em] text-soft transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>
      </div>
    </Section>
  )
}
