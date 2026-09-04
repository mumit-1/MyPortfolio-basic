/**
 * Generates the "blueprint poster" tiles for the Work masonry wall as inline
 * SVG data URIs — no image assets, no network, and they retheme by editing here.
 *
 * Note: an SVG inside <img> can't load webfonts, so poster type is set in a
 * monospace stack (deliberately terminal-ish). Real typography lives in the DOM.
 */

const INK = '#F5F5F5'
const MUTED = '#8F8F8F'
const CARD = '#111111'

// Hue is off the table, so tone does the differentiating: each poster draws its
// line art one step down the monochrome ramp from the last.
const ACCENTS = ['#FFFFFF', '#BDBDBD', '#7E7E7E']

// Simple line-art marks, drawn on a 400x560 canvas centred around y=190.
const GLYPHS = {
  trophy: `
    <path d="M150 118h100v46a50 50 0 0 1-100 0z"/>
    <path d="M150 128h-22a26 26 0 0 0 26 30"/>
    <path d="M250 128h22a26 26 0 0 1-26 30"/>
    <path d="M200 210v32"/>
    <path d="M168 250h64"/>`,
  cart: `
    <path d="M138 140h26l22 78h84l24-58H176"/>
    <circle cx="192" cy="242" r="13"/>
    <circle cx="252" cy="242" r="13"/>`,
  briefcase: `
    <path d="M140 156h120v92H140z"/>
    <path d="M176 156v-18h48v18"/>
    <path d="M140 196h120"/>
    <path d="M188 190h24v14h-24z"/>`,
}

const wrap = (text, max) => {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (next.length > max && line) {
      lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 2)
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * @param {{ title: string, tagline: string, tags?: string[], icon?: keyof typeof GLYPHS, index?: number }} project
 * @returns {string} data URI usable as a CSS background-image / <img> src
 */
export function posterDataUri({ title, tagline, tags = [], icon = 'trophy', index = 0 }) {
  const glyph = GLYPHS[icon] ?? GLYPHS.trophy
  const titleLines = wrap(String(title).toUpperCase(), 13)
  const tagLine = tags.slice(0, 3).join('  ·  ').toUpperCase()
  // Rotate the accent so the three posters don't read as identical.
  const accent = ACCENTS[index % ACCENTS.length]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560">
  <defs>
    <pattern id="g" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0v26" fill="none" stroke="${accent}" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
    <radialGradient id="bloom" cx="50%" cy="34%" r="52%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${accent}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="400" height="560" fill="${CARD}"/>
  <rect width="400" height="560" fill="url(#g)"/>
  <rect width="400" height="560" fill="url(#bloom)"/>

  <g fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
    ${glyph}
  </g>
  <circle cx="200" cy="190" r="118" fill="none" stroke="${accent}" stroke-opacity="0.28"/>
  <circle cx="200" cy="190" r="150" fill="none" stroke="${accent}" stroke-opacity="0.14"/>

  <rect x="40" y="356" width="320" height="1.5" fill="url(#rule)"/>

  <g font-family="ui-monospace, 'Courier New', monospace" text-anchor="middle">
    ${titleLines
      .map(
        (l, i) =>
          `<text x="200" y="${408 + i * 38}" font-size="31" font-weight="700" letter-spacing="1.5" fill="${INK}">${esc(l)}</text>`,
      )
      .join('\n    ')}
    <text x="200" y="${titleLines.length > 1 ? 480 : 446}" font-size="13" letter-spacing="1.2" fill="${MUTED}">${esc(
      String(tagline).toUpperCase(),
    )}</text>
    <text x="200" y="524" font-size="10.5" letter-spacing="1.6" fill="${accent}" opacity="0.85">${esc(tagLine)}</text>
  </g>

  <rect x="0.75" y="0.75" width="398.5" height="558.5" fill="none" stroke="${accent}" stroke-opacity="0.35"/>
</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
