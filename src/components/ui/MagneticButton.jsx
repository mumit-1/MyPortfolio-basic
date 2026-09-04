import { useRef } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

// Element that eases toward the cursor while hovered, then springs back.
export default function MagneticButton({
  as = 'a',
  strength = 0.4,
  className,
  children,
  ...props
}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })

  const handleMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const MotionTag = motion[as] ?? motion.a

  return (
    <MotionTag
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
