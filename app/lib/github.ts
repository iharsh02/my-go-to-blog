// Public GitHub data, fetched once at build time (pages are prerendered).
// Every function returns null on failure so the page still builds offline.

export type Day = { date: string; level: number; count: number }
export type Contributions = { total: number; weeks: Day[][] }

export type GitHubProfile = {
  login: string
  name: string | null
  bio: string | null
  avatar: string
  location: string | null
  repos: number
  followers: number
  following: number
  joined: string
}

const opts = { cache: 'force-cache', signal: AbortSignal.timeout(8000) } as const

export async function getContributions(
  user: string
): Promise<Contributions | null> {
  try {
    let res = await fetch(`https://github.com/users/${user}/contributions`, opts)
    if (!res.ok) return null
    let html = await res.text()

    // Counts live in tooltips keyed by the cell id
    let counts = new Map<string, number>()
    for (let [, id, text] of html.matchAll(
      /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
    )) {
      counts.set(id, parseInt(text) || 0)
    }

    // Cell ids are contribution-day-component-{weekday}-{week}
    let weeks: Day[][] = []
    for (let [tag] of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      let id = /id="([^"]+)"/.exec(tag)?.[1]
      let date = /data-date="([^"]+)"/.exec(tag)?.[1]
      let level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0)
      let pos = id && /-(\d+)-(\d+)$/.exec(id)
      if (!id || !date || !pos) continue
      let [day, week] = [Number(pos[1]), Number(pos[2])]
      ;(weeks[week] ??= [])[day] = { date, level, count: counts.get(id) ?? 0 }
    }

    let total = /([\d,]+)\s+contributions?\s+in the last year/.exec(html)?.[1]
    if (!weeks.length || !total) return null
    return { total: Number(total.replace(/,/g, '')), weeks: weeks.filter(Boolean) }
  } catch {
    return null
  }
}


export async function getProfile(user: string): Promise<GitHubProfile | null> {
  try {
    let res = await fetch(`https://api.github.com/users/${user}`, {
      ...opts,
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    let u = await res.json()
    return {
      login: u.login,
      name: u.name,
      bio: u.bio,
      avatar: `${u.avatar_url}${u.avatar_url.includes('?') ? '&' : '?'}s=96`,
      location: u.location,
      repos: u.public_repos,
      followers: u.followers,
      following: u.following,
      joined: new Date(u.created_at).toLocaleDateString('en-us', { month: 'short', year: 'numeric' }),
    }
  } catch {
    return null
  }
}
