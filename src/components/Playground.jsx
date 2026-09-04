import { useReducedMotion } from 'framer-motion'
import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import Cubes from './ui/Cubes'
import { site } from '../data/site'

/**
 * Playground — no deadline, no client. The cube field leans toward the pointer
 * and ripples on click; it drifts on its own when nobody's touching it.
 */
export default function Playground() {
  const reduce = useReducedMotion()
  const { eyebrow, title, body } = site.playground

  return (
    <Section id="play">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <BlurFade>
            <p className="eyebrow">{eyebrow}</p>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>
          </BlurFade>
          <BlurFade delay={0.12}>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-soft">{body}</p>
          </BlurFade>
          <BlurFade delay={0.18}>
            <p className="mt-6 font-term text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {reduce ? 'motion reduced · static grid' : 'drag · click to ripple'}
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.1}>
          <div className="mx-auto w-full max-w-[420px]">
            <Cubes
              gridSize={6}
              maxAngle={48}
              radius={2.6}
              autoAnimate={!reduce}
              rippleOnClick={!reduce}
              faceColor="#111111"
              borderStyle="1px solid rgba(255,255,255,0.42)"
              rippleColor="#ffffff"
            />
          </div>
        </BlurFade>
      </div>
    </Section>
  )
}
