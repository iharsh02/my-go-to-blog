# Prerender everything at build time for Cloudflare Workers

The site deploys to Cloudflare Workers through OpenNext, and Workers have no filesystem at runtime. Posts are MDX files read from disk, so every page, post route and the RSS feed is generated at build time (`dynamicParams = false`, `dynamic = 'force-static'`), and OpenNext serves them from the static-assets incremental cache. The same applies to external data: the GitHub profile and contribution graph are fetched once during the build.

## Consequences

- New posts and fresh GitHub numbers only appear after a redeploy. There is no ISR: the static-assets cache is read-only.
- Anything fetched at build time must return `null` on failure, so a build without network still succeeds and the UI shows a fallback.
- The posts folder can be missing (Git doesn't track empty folders), so reading it must tolerate its absence.
- Work that only needs to happen once, such as generating the DiceBear avatar, runs on the server, which also keeps those libraries out of the client bundle.
