// Everything personal lives here — edit this file to make the site yours.
export const site = {
  name: 'Harsh Thakur',
  // Short line under your name on the home page
  tagline: 'keep it real!',
  // Shown in the header pill and the social previews
  role: 'Software developer',
  url: 'https://keepitreal-nine.vercel.app',
  description:
    'Software developer interested in systems, tooling, and the messy parts of software that usually get hidden behind abstractions.',
  // One string per paragraph on the home page. Wrap words in **double stars** to bold them.
  about: [
    "I'm a **software developer** interested in **systems**, **tooling**, and the messy parts of software that usually get hidden behind abstractions.",
    'I spend my time writing code, experimenting with **Linux** and **C++**, exploring **game/server architecture**, and occasionally going down a rabbit hole that started with a simple question.',
    'This site is where I keep **the things I build** and **the things I learn**.',
  ],
  email: 'msy2707uz@mozmail.com',
  github: 'iharsh02',
  // Shown in the X hover preview. Copied from x.com/iharsh02 on 2026-11-24;
  // counts don't update on their own, so refresh them now and then.
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
  // Set hidden: true to keep a link here but leave it off the site
  links: [
    { label: 'GitHub', href: 'https://github.com/iharsh02' },
    { label: 'X', href: 'https://x.com/iharsh02' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/iharsh02/', hidden: true },
    { label: 'Email', href: 'mailto:msy2707uz@mozmail.com' },
    { label: 'RSS', href: '/rss' },
  ] as { label: string; href: string; hidden?: boolean }[],
}

// The links actually shown on the site
export const visibleLinks = site.links.filter((link) => !link.hidden)
