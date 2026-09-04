import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Decrypted Text (React Bits) — scrambles then resolves the string. Ported:
 * import switched motion/react → framer-motion. animateOn: hover | click |
 * view | inViewHover. Screen-reader text stays the resolved value.
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!<>-_/[]{}=+*',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Set())
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    let interval
    let currentIteration = 0

    const getNextIndex = (revealedSet) => {
      const textLength = text.length
      switch (revealDirection) {
        case 'end':
          return textLength - 1 - revealedSet.size
        case 'center': {
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealedSet.size / 2)
          const next =
            revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1
          if (next >= 0 && next < textLength && !revealedSet.has(next)) return next
          for (let i = 0; i < textLength; i++) if (!revealedSet.has(i)) return i
          return 0
        }
        case 'start':
        default:
          return revealedSet.size
      }
    }

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
      : characters.split('')

    const shuffleText = (original, currentRevealed) => {
      if (useOriginalCharsOnly) {
        const positions = original.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i),
        }))
        const pool = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char)
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }
        let k = 0
        return positions
          .map((p) => {
            if (p.isSpace) return ' '
            if (p.isRevealed) return original[p.index]
            return pool[k++]
          })
          .join('')
      }
      return original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (currentRevealed.has(i)) return original[i]
          return availableChars[Math.floor(Math.random() * availableChars.length)]
        })
        .join('')
    }

    if (isHovering) {
      setIsScrambling(true)
      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          if (sequential) {
            if (prev.size < text.length) {
              const next = getNextIndex(prev)
              const updated = new Set(prev)
              updated.add(next)
              setDisplayText(shuffleText(text, updated))
              return updated
            }
            clearInterval(interval)
            setIsScrambling(false)
            return prev
          }
          setDisplayText(shuffleText(text, prev))
          currentIteration++
          if (currentIteration >= maxIterations) {
            clearInterval(interval)
            setIsScrambling(false)
            setDisplayText(text)
          }
          return prev
        })
      }, speed)
    } else {
      setDisplayText(text)
      setRevealedIndices(new Set())
      setIsScrambling(false)
    }

    return () => interval && clearInterval(interval)
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ])

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // leave the plain text in place
    const cb = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true)
          setHasAnimated(true)
        }
      })
    }
    const observer = new IntersectionObserver(cb, { threshold: 0.15 })
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => el && observer.unobserve(el)
  }, [animateOn, hasAnimated])

  const interactionProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : animateOn === 'click'
        ? { onClick: () => setIsHovering((v) => !v) }
        : {}

  return (
    <motion.span
      ref={containerRef}
      className={parentClassName}
      {...interactionProps}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const revealed =
            revealedIndices.has(index) || !isScrambling || !isHovering
          return (
            <span
              key={index}
              className={revealed ? className : encryptedClassName}
            >
              {char}
            </span>
          )
        })}
      </span>
    </motion.span>
  )
}
