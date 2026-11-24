export const site = {
  name: 'Harsh Thakur',
  tagline: 'keep it real!',
  role: 'Software developer',
  url: 'https://keepitreal-nine.vercel.app',
  description:
    'Software developer interested in systems, tooling, and the messy parts of software that usually get hidden behind abstractions.',
  about: [
    "I'm a **software developer** interested in **systems**, **tooling**, and the messy parts of software that usually get hidden behind abstractions.",
    'I spend my time writing code, experimenting with **Linux** and **C++**, exploring **game/server architecture**, and occasionally going down a rabbit hole that started with a simple question.',
    'This site is where I keep **the things I build** and **the things I learn**.',
  ],
  email: 'msy2707uz@mozmail.com',
  github: 'iharsh02',
  x: {
    name: 'Senpai',
    handle: 'iharsh02',
    verified: true,
    avatar: '/x/avatar.jpg',
    banner: '/x/banner.jpg',
    location: 'Himachal Pradesh, India',
    joined: 'May 2020',
    following: 178,
    followers: 27,
    bio: 'Carbon-based lifeform operating on caffeine and sheer optimism.',
  },
  links: [
    { label: 'GitHub', href: 'https://github.com/iharsh02' },
    { label: 'X', href: 'https://x.com/iharsh02' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/iharsh02/', hidden: true },
    { label: 'Email', href: 'mailto:msy2707uz@mozmail.com' },
    { label: 'RSS', href: '/rss' },
  ] as { label: string; href: string; hidden?: boolean }[],
}

export const visibleLinks = site.links.filter((link) => !link.hidden)
