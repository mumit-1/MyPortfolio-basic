import { motion, useReducedMotion } from 'framer-motion'

// Reveals children with a blur + rise as they scroll into view.
export default function BlurFade({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}) {
  const reduce = useReducedMotion()

  const initial = reduce
    ? { opacity: 0 }
    : { opacity: 0, y, filter: 'blur(10px)' }
  const inView = reduce
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={inView}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
