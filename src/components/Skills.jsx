import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import FlowingMenu from './ui/FlowingMenu'
import { site } from '../data/site'

/**
 * Stack — the tools, as rows whose white fill sweeps in from whichever edge the
 * cursor arrives from. Each row links to the thing itself.
 */
export default function Skills() {
  return (
    <Section id="stack">
      <div className="mb-10 max-w-2xl">
        <BlurFade>
          <p className="eyebrow">stack</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h2 className="mt-3 text-4xl sm:text-5xl">What I build with</h2>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mt-4 text-lg leading-relaxed text-soft">
            Run the cursor down the list. Everything here is something I&apos;ve shipped with, not
            something I&apos;ve read about.
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.16}>
        <div className="h-[62vh] min-h-[460px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <FlowingMenu
            items={site.stack.rows}
            speed={18}
            textColor="var(--fg)"
            marqueeBgColor="var(--accent)"
            marqueeTextColor="#050505"
            borderColor="var(--border)"
          />
        </div>
      </BlurFade>

      {/* the fuller picture, compactly */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {site.stack.groups.map((group, i) => (
          <BlurFade key={group.title} delay={0.2 + i * 0.06}>
            <h3 className="font-term text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
              {group.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-soft">{group.items.join(' · ')}</p>
          </BlurFade>
        ))}
      </div>
    </Section>
  )
}
