import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

/**
 * Flowing Menu (React Bits) — rows whose white fill sweeps in from the nearest
 * edge on hover, revealing a scrolling marquee. Ported with theme tweaks:
 *   - token-driven monochrome (transparent base so it sits on the section bg)
 *   - `image` is optional; without it a gradient "pill" repeats instead
 *   - the infinite marquee tween is skipped under prefers-reduced-motion
 * Parent must have an explicit height (rows divide it with flex-1).
 */
function FlowingMenu({
  items = [],
  speed = 15,
  textColor = 'var(--fg)',
  bgColor = 'transparent',
  marqueeBgColor = '#ffffff',
  marqueeTextColor = '#050505',
  borderColor = 'var(--border)',
}) {
  return (
    <div className="h-full w-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <nav className="m-0 flex h-full flex-col p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  )
}

function MenuItem({ link, text, meta, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, isFirst }) {
  const itemRef = useRef(null)
  const marqueeRef = useRef(null)
  const marqueeInnerRef = useRef(null)
  const animationRef = useRef(null)
  const [repetitions, setRepetitions] = useState(4)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part')
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [text, image])

  useEffect(() => {
    if (prefersReduced) return
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part')
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return

      if (animationRef.current) {
        animationRef.current.kill()
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })
    }

    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [text, image, repetitions, speed, prefersReduced])

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div
      className="relative flex-1 overflow-hidden text-center"
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}` }}
    >
      <a
        className="relative flex h-full items-center justify-center gap-[2vw] font-display text-[3.2vh] font-extrabold uppercase tracking-tight no-underline"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
        {meta ? (
          <span className="font-term text-[1.3vh] font-normal tracking-[0.2em] text-soft">{meta}</span>
        ) : null}
      </a>
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full translate-y-[101%] overflow-hidden"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flex h-full w-fit" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex flex-shrink-0 items-center" key={idx} style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap px-[1vw] text-[3.2vh] font-extrabold uppercase leading-[1]">{text}</span>
              {image ? (
                <div
                  className="mx-[2vw] my-[2em] h-[5vh] w-[160px] rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                <div className="mx-[2vw] my-[2em] h-[1.4vh] w-[90px] rounded-full bg-current opacity-90" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu
