import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowDown, FiMail } from 'react-icons/fi'
import Beams from './ui/Beams'
import GridFloor from './ui/GridFloor'
import MagicRings from './ui/MagicRings'
import TextPressure from './ui/TextPressure'
import MorphingText from './ui/MorphingText'
import MagneticButton from './ui/MagneticButton'
import GradualBlur from './ui/GradualBlur'
import { site } from '../data/site'

/**
 * The signature screen: white light beams behind a receding grid floor, a ringed
 * halo, and the name set in Archivo as a hairline that thickens and widens under
 * the cursor. Everything heavy waits for `ready` (preloader gone) and folds down
 * to a static frame under prefers-reduced-motion.
 */
export default function Hero({ ready = true }) {
  const reduce = useReducedMotion()
  const animate = ready && !reduce

  const rise = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: 'blur(10px)' },
    animate: ready
      ? reduce
        ? { opacity: 1 }
        : { opacity: 1, y: 0, filter: 'blur(0px)' }
      : undefined,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-6 pb-28 pt-32 md:px-10"
    >
      {/* animated light shafts (WebGL — desktop-friendly, motion-gated) */}
      {animate && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        >
          <Beams beamNumber={11} beamWidth={2.4} beamHeight={16} speed={1.6} noiseIntensity={1.5} scale={0.2} rotation={-8} />
        </motion.div>
      )}

      {/* receding grid floor */}
      <GridFloor className="-z-10" />

      {/* ringed halo behind the name */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-[58%]">
        {/* <MagicRings /> */}
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p className="eyebrow" {...rise(0.05)}>
          {site.tagline}
        </motion.p>

        {/* the name — a hairline that thickens and widens under the cursor.
            No glow here on purpose: bloom on a 100-weight stroke turns it to mush. */}
        <motion.div className="mt-6" {...rise(0.14)}>
          {animate ? (
            <div className="h-[clamp(56px,13.5vw,180px)] w-full">
              <TextPressure
                text={site.name}
                fontFamily="Archivo"
                weight
                width
                italic={false}
                alpha={false}
                minFontSize={34}
                charWidthRatio={0.68}
                minWeight={100}
                maxWeight={900}
                minWidth={90}
                maxWidth={120}
                textColor="var(--fg)"
              />
            </div>
          ) : (
            <h1 className="text-[clamp(2.4rem,11vw,9rem)] font-thin uppercase leading-none tracking-[0.04em]">
              {site.name}
            </h1>
          )}
        </motion.div>

        {/* role line — gooey morph between the things he is */}
        <motion.div className="mt-4 sm:mt-6" {...rise(0.22)}>
          <h2 className="sr-only">{site.role}</h2>
          <MorphingText
            texts={site.roles}
            className="mx-0 h-12 font-display text-[clamp(0.95rem,2.4vw,1.75rem)] font-extrabold uppercase tracking-[0.16em] text-left text-[var(--accent)] sm:h-14"
          />
        </motion.div>

        <motion.p className="mt-2 max-w-xl text-base leading-relaxed text-soft sm:text-lg" {...rise(0.3)}>
          {site.intro}
        </motion.p>

        <motion.div className="mt-10 flex flex-wrap items-center gap-4" {...rise(0.38)}>
          <MagneticButton
            as="a"
            href={`mailto:${site.email}`}
            className="bg-grad group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-term text-sm uppercase tracking-[0.18em] text-[#050505] shadow-neon transition-shadow hover:shadow-neon-lg"
          >
            <FiMail className="text-base" />
            hire me
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#work"
            strength={0.25}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-7 py-3.5 font-term text-sm uppercase tracking-[0.18em] text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            see the work
          </MagneticButton>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-soft transition-colors hover:text-[var(--accent)]"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <FiArrowDown className={reduce ? 'text-xl' : 'animate-float text-xl'} />
      </motion.a>

      {/* melt the hero into the next section instead of ending on a line */}
      <GradualBlur position="bottom" height="9rem" strength={2} divCount={7} zIndex={5} />
    </section>
  )
}
