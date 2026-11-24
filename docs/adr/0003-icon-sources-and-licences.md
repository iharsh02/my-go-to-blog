# Inline icon paths from licensed sources

Icons are inline SVG paths in `app/components/icons.tsx` instead of an icon package, so the client ships only the handful in use. The sources carry licence obligations that are not visible in the code:

- Brand marks (GitHub, X, LinkedIn, RSS) come from Simple Icons (CC0). They render in their official colors; black marks flip to white in dark mode, which the brands' own guidelines allow.
- UI stroke icons follow Lucide's geometry (ISC licence).
- The X verified badge in the profile preview is our own drawing (a 16-point star with rounded joins), not X's asset.

Adding an icon means taking it from one of these sources, or drawing it, and keeping this list accurate.
