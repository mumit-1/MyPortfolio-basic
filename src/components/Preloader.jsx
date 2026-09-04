import { motion } from 'framer-motion'
import GlyphMatrix from './ui/GlyphMatrix'
import DecryptedText from './ui/DecryptedText'
import { site } from '../data/site'

/**
 * Boot sequence. A glowing glyph matrix runs behind a terminal panel while the
 * name and role decrypt into place, then the whole thing lifts away like a
 * curtain. App skips mounting this entirely for reduced-motion users.
 */
export default function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
    >
      {/* mutating glyph field */}
      <div className="absolute inset-0 opacity-70">
        <GlyphMatrix cellSize={16} interval={70} mutationRate={0.08} color="var(--accent)" />
      </div>

      {/* horizon bloom so the panel sits in light, not on flat black */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(58% 46% at 50% 52%, var(--glow), transparent 70%)',
          opacity: 0.5,
        }}
      />

      <motion.div
        className="panel relative mx-6 w-full max-w-lg rounded-xl px-7 py-8 shadow-neon-lg"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="font-term text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
          <span aria-hidden>&gt;</span> booting
          <span className="animate-blink ml-1 inline-block">_</span>
        </p>

        <h1 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-[0.12em] sm:text-3xl">
          <DecryptedText
            text={site.name}
            animateOn="view"
            sequential
            speed={45}
            useOriginalCharsOnly={false}
            className="text-[var(--fg)]"
            encryptedClassName="text-[var(--accent)] opacity-70"
          />
        </h1>

        <p className="mt-3 font-term text-sm uppercase tracking-[0.2em] text-soft">
          <DecryptedText
            text={site.role}
            animateOn="view"
            sequential
            speed={22}
            className="text-soft"
            encryptedClassName="text-[var(--accent-2)] opacity-60"
          />
        </p>

        {/* load bar — purely indicative, matched to App's timing */}
        <div className="mt-7 h-px w-full overflow-hidden bg-[var(--border)]">
          <motion.div
            className="bg-grad h-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
