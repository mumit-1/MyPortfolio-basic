import { FiFacebook, FiGithub, FiInstagram, FiLinkedin, FiMail,FiFileText  } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Section from './ui/Section'
import BlurFade from './ui/BlurFade'
import PixelCard from './ui/PixelCard'
import MagneticButton from './ui/MagneticButton'
import { site } from '../data/site'

const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  mail: FiMail,
  whatsapp: FaWhatsapp,
  instagram: FiInstagram,
  facebook: FiFacebook,
  resume: FiFileText,
}

/** Contact — one loud way in, then every other door as a pixel card. */
export default function Contact() {
  return (
    <Section id="contact" grid>
      <div className="mx-auto max-w-3xl text-center">
        <BlurFade>
          <p className="eyebrow">contact</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h2 className="mt-3 text-4xl sm:text-6xl">
            Got something to build?
          </h2>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-soft">
            I&apos;m open to internships and freelance work. Send a line and I&apos;ll reply — the
            inbox is the fastest route.
          </p>
        </BlurFade>

        <BlurFade delay={0.2}>
          <MagneticButton
            as="a"
            href={`mailto:${site.email}`}
            className="bg-grad mt-9 inline-flex items-center gap-3 rounded-full px-9 py-4 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-[#050505] shadow-neon-lg transition-shadow hover:shadow-neon-hot sm:text-base"
          >
            <FiMail className="text-lg" />
            {site.email}
          </MagneticButton>
        </BlurFade>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {site.socials.map((social, i) => {
          const Icon = ICONS[social.icon] ?? FiMail
          const external = social.href.startsWith('http')
          return (
            <BlurFade key={social.label} delay={i * 0.05} className="h-full">
              <PixelCard variant="neon" tabbable={false} className="w-full">
                <a
                  href={social.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="relative flex h-full w-full flex-col items-start gap-3 p-5 sm:p-6"
                >
                  <Icon className="text-2xl text-[var(--accent)]" aria-hidden />
                  <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--fg)]">
                    {social.label}
                  </span>
                  <span className="break-all font-term text-xs tracking-wide text-soft">
                    {social.handle}
                  </span>
                </a>
              </PixelCard>
            </BlurFade>
          )
        })}
       
      </div>
      
    </Section>
  )
}
