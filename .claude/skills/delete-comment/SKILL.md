---
name: delete-comment
description: Sweep code comments out of the codebase (or one path): classify each, delete it, file issues for hacks, move decisions into ADRs, and lower the comment ratchet.
disable-model-invocation: true
argument-hint: "[path to limit the sweep, e.g. app/components]"
---

# Delete comments

This codebase bans comments. `pnpm lint:comments` (`scripts/lint-comments.mjs`) enforces it with a **ratchet**: `comment-baseline.json` freezes each file that still has comments at its current count, and the count may only go down. Your job is to drive those counts toward zero without losing anything worth knowing.

Scope is `$ARGUMENTS` when given, otherwise the whole codebase.

## 1. Inventory

Run `pnpm lint:comments --list` and keep only lines under the scope. Done when you hold every comment in scope as `file:line`, with its text.

## 2. Classify

Read the code around each comment, then give it exactly one category:

- **Tautology**: says what the code (names, types, JSX) already shows, or what `DESIGN.md` or an ADR already records.
- **Stale**: describes code, files, tokens or behaviour that no longer exist. Grep before trusting it.
- **Excuse**: explains away a hack: a workaround, a fragile dependency, data copied by hand, a "for now".
- **Decision Record**: a non-obvious reason the code is shaped this way. It must meet the ADR bar: hard to reverse, surprising without context, and the result of a real trade-off. If it misses any of the three, it is a Tautology.

Done when every comment in scope has a category and a one-line reason.

## 3. Act

- **Tautology / Stale**: delete.
- **Excuse**: delete, and file a GitHub issue with `gh issue create` that names the file, explains why the implementation is fragile and proposes a fix. One issue per hack, not per comment.
- **Decision Record**: delete, and record the reason in `docs/adr/` (format: `NNNN-slug.md`, a title and a short paragraph; optional Consequences). Extend an existing ADR when it covers the same decision, and group related comments into one ADR.

Delete precisely: a standalone comment takes its whole line (a JSX `{/* … */}` takes its braces), a trailing comment is trimmed off its code line, and no runs of blank lines are left behind. Tool pragmas (`@ts-*`, `eslint-*`, `prettier-ignore`, `///` references) are not comments for this purpose; leave them.

Done when every comment in scope is gone, each Excuse has an issue URL and each Decision Record has an ADR.

## 4. Verify and lock in

1. `pnpm lint:comments --list` shows no comments in scope.
2. `pnpm lint:comments --update` lowers the baseline. It never raises it, so a deferred comment keeps its current allowance.
3. `npx tsc --noEmit` and `pnpm build` pass.

## 5. Report

A table of every comment (`file:line`, category, action), the issue URLs, the ADRs created or extended, and the lines shed: full-line comments removed plus trailing comments trimmed.
