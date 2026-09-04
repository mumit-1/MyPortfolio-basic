// Single source of truth for all site content. Edit here to update the site.
// import { FileDown,FileText } from 'lucide-react'
export const site = {
  name: 'Mumit Khan',
  monogram: 'MK',
  role: 'Web Developer',
  // Cycled by the hero's Morphing Text — first entry stays the canonical headline.
  roles: [
    'Web Developer',
    'React Engineer',
    'Interface Builder',
    'CSE @ BRAC',
  ],
  tagline: 'CSE @ BRAC University · Dhaka',
  location: 'Dhaka, Bangladesh',
  email: 'mumitkhan85@gmail.com',
  // Profile photo lives in /public. Falls back to the old image until the new one is added.
  photo: '/profile.jpeg',
  intro:
    'I build fast, responsive web interfaces — and I like the details that make them feel alive.',

  nav: [
    { label: 'about', href: '#about' },
    { label: 'stack', href: '#stack' },
    { label: 'work', href: '#work' },
    { label: 'play', href: '#play' },
    { label: 'contact', href: '#contact' },
  ],

  about: {
    body: [
      "I'm a Computer Science & Engineering student at BRAC University who fell for the web the moment I realised I could build the things I use every day.",
      'I work mostly in React — turning designs and rough ideas into responsive interfaces with clean state and motion that feels intentional. So far I’ve shipped a fantasy-cricket app, a full e-commerce front end, and an auth-protected counseling platform.',
      "Right now I'm going deeper into full-stack work: APIs, databases, and the glue that turns a front end into a real product.",
    ],
    facts: [
      'Based in Dhaka, Bangladesh',
      'BRAC University · CSE',
      'Focused on React & the modern web',
      'Open to internships & freelance',
    ],
  },

  stack: {
    // Rows for the Skills flowing menu — each links out to the thing's own home.
    rows: [
      { text: 'React', meta: 'interfaces', link: 'https://react.dev' },
      { text: 'JavaScript', meta: 'language', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { text: 'Tailwind CSS', meta: 'styling', link: 'https://tailwindcss.com' },
      { text: 'React Router', meta: 'routing', link: 'https://reactrouter.com' },
      { text: 'Firebase', meta: 'auth & data', link: 'https://firebase.google.com' },
      { text: 'Framer Motion', meta: 'motion', link: 'https://motion.dev' },
      { text: 'Vite', meta: 'tooling', link: 'https://vite.dev' },
      { text: 'Git & GitHub', meta: 'workflow', link: 'https://github.com/mumit-1' },
    ],
    marquee: [
      'React',
      'JavaScript',
      'Tailwind CSS',
      'Firebase',
      'Vite',
      'Framer Motion',
      'Git',
      'React Router',
      'DaisyUI',
      'Node.js',
      'Recharts',
      'Swiper',
    ],
    groups: [
      {
        title: 'Frontend',
        items: [
          'React',
          'JavaScript (ES6+)',
          'Tailwind CSS',
          'DaisyUI',
          'React Router',
          'HTML5 & CSS3',
        ],
      },
      {
        title: 'Tools & Platforms',
        items: ['Vite', 'Git & GitHub', 'Firebase', 'Framer Motion'],
      },
      {
        title: 'Learning now',
        items: ['Node.js', 'REST APIs', 'TypeScript'],
      },
    ],
  },

  projects: [
    {
      name: 'Dream 11',
      tagline: 'Fantasy cricket team builder',
      description:
        'Pick a squad under a coin budget with live validation — duplicate-player guards, "not enough coins" prompts, and toast feedback on every action. Toggle between available and selected players.',
      tags: ['React', 'Tailwind', 'DaisyUI', 'React Toastify'],
      live: 'https://assignment7ph.surge.sh',
      code: 'https://github.com/programming-hero-web-course1/b10a7-dream-11-mumit-1',
      icon: 'trophy',
    },
    {
      name: 'GadgetHaven',
      tagline: 'Gadget e-commerce front end',
      description:
        'A multi-page storefront with category filtering, cart and wishlist flows, persistent state, and a stats dashboard built on Recharts. Routing, sorting, and price charts included.',
      tags: ['React Router', 'Recharts', 'localForage', 'React Rating'],
      live: 'https://ph-a-8.surge.sh',
      code: 'https://github.com/programming-hero-web-course-4/b10a8-gadget-heaven-mumit-1',
      icon: 'cart',
    },
    {
      name: 'Career Counseling',
      tagline: 'Auth-protected guidance platform',
      description:
        'Firebase email and Google auth with protected routes, a service catalogue, a dynamic feedback system, and an animated slider. Log in to view service details and your profile.',
      tags: ['Firebase Auth', 'Framer Motion', 'Swiper', 'React Router'],
      live: 'https://ph-a-9.surge.sh',
      code: 'https://github.com/programming-hero-web-course1/b10-a9-authentication-mumit-1',
      icon: 'briefcase',
    },
  ],

  playground: {
    eyebrow: 'playground',
    title: 'Poke the grid',
    body: 'A little corner with no deadline. Drag across the cubes — they tilt and ripple under the cursor. Because a portfolio should show you actually like this stuff.',
  },

  education: {
    school: 'BRAC University',
    degree: 'BSc in Computer Science & Engineering',
    period: 'Undergraduate',
    location: 'Dhaka, Bangladesh',
    note: 'Coursework across data structures, algorithms, OOP, and databases — plus a lot of self-driven web development on the side.',
  },

  socials: [
    { label: 'GitHub', handle: 'mumit-1', href: 'https://github.com/mumit-1', icon: 'github' },
    { label: 'LinkedIn', handle: 'in/mumit', href: 'https://www.linkedin.com/in/mumit', icon: 'linkedin' },
    { label: 'Email', handle: 'mumitkhan85@gmail.com', href: 'mailto:mumitkhan85@gmail.com', icon: 'mail' },
    // { label: 'WhatsApp', handle: '+880 1331-364480', href: 'https://wa.me/8801331364480', icon: 'whatsapp' },
    { label: 'Instagram', handle: '@mumittt_', href: 'https://www.instagram.com/mumittt_/', icon: 'instagram' },
    {
      label: 'Facebook',
      handle: 'Mumit Khan',
      href: 'https://www.facebook.com/profile.php?id=100076425950558',
      icon: 'facebook',
    },
    {
  label: 'Resume',
  handle: 'Download CV (PDF)',
  href: '/Mumit_CV.pdf',
  icon: 'resume', // import { FileDown } from 'lucide-react'
}
  ],
}
