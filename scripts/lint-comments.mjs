#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const BASELINE = path.join(ROOT, 'comment-baseline.json')
const DIRS = ['app', 'scripts']
const ROOT_FILES = ['next.config.ts', 'open-next.config.ts', 'postcss.config.js']
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css'])
const PRAGMA = /^(\/\/|\/\*)\s*(@ts-|eslint-|prettier-ignore)|^\/\/\/\s*</

function files() {
  let out = ROOT_FILES.filter((f) => fs.existsSync(path.join(ROOT, f)))
  let walk = (dir) => {
    for (let entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      let rel = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(rel)
      else if (EXTS.has(path.extname(entry.name))) out.push(rel)
    }
  }
  DIRS.filter((d) => fs.existsSync(path.join(ROOT, d))).forEach(walk)
  return out.sort()
}

function cssComments(text) {
  return [...text.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => ({ pos: m.index, end: m.index + m[0].length }))
}

function scriptComments(text, file) {
  let kind = file.endsWith('x') ? ts.ScriptKind.TSX : file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS
  let source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)
  let found = new Map()
  let add = (ranges) => ranges?.forEach((r) => found.set(r.pos, r))
  let visit = (node) => {
    if (node.kind === ts.SyntaxKind.JsxText) return
    if (node.kind < ts.SyntaxKind.FirstNode || node.getChildCount(source) === 0) {
      add(ts.getLeadingCommentRanges(text, node.pos))
      add(ts.getTrailingCommentRanges(text, node.end))
    }
    node.getChildren(source).forEach(visit)
  }
  visit(source)
  add(ts.getLeadingCommentRanges(text, source.endOfFileToken.pos))
  return [...found.values()]
}

function scan(file) {
  let text = fs.readFileSync(path.join(ROOT, file), 'utf8')
  let ranges = file.endsWith('.css') ? cssComments(text) : scriptComments(text, file)
  return ranges
    .map(({ pos, end }) => {
      let body = text.slice(pos, end)
      let line = text.slice(0, pos).split('\n').length
      return { line, lines: body.split('\n').length, body }
    })
    .filter((c) => !PRAGMA.test(c.body))
    .sort((a, b) => a.line - b.line)
}

const HELP = `Comment ratchet: comments are banned; files that still have some are frozen
at their count in comment-baseline.json, which may only go down.

  pnpm lint:comments            fail if any file has more comments than its baseline
  pnpm lint:comments --update   lower the baseline to the current counts (never raises it)
  pnpm lint:comments --list     print every comment as file:line

Tool pragmas (@ts-*, eslint-*, prettier-ignore, triple-slash references) are not counted.`

let mode = process.argv[2]
if (mode === '--help') {
  console.log(HELP)
  process.exit(0)
}
let counts = {}
let all = {}
for (let file of files()) {
  let comments = scan(file)
  if (comments.length) {
    counts[file] = comments.length
    all[file] = comments
  }
}

if (mode === '--list') {
  let total = 0
  for (let [file, comments] of Object.entries(all)) {
    for (let c of comments) {
      total += c.lines
      console.log(`${file}:${c.line}  ${c.body.replace(/\s*\n\s*/g, ' ⏎ ')}`)
    }
  }
  console.log(`\n${Object.values(counts).reduce((a, b) => a + b, 0)} comments, ${total} lines`)
  process.exit(0)
}

let baseline = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {}

if (mode === '--update') {
  let seeding = !fs.existsSync(BASELINE)
  let next = {}
  for (let [file, n] of Object.entries(counts)) {
    let allowed = Math.min(n, baseline[file] ?? (seeding ? n : 0))
    if (allowed > 0) next[file] = allowed
  }
  fs.writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n')
  console.log(`comment-baseline.json: ${Object.values(next).reduce((a, b) => a + b, 0)} comments allowed`)
  process.exit(0)
}

let failed = false
for (let [file, n] of Object.entries(counts)) {
  let allowed = baseline[file] ?? 0
  if (n > allowed) {
    failed = true
    console.error(`${file}: ${n} comments, ${allowed} allowed. Delete the new ones:`)
    all[file].forEach((c) => console.error(`  ${file}:${c.line}  ${c.body.split('\n')[0]}`))
  }
}
let lowered = Object.entries(baseline).filter(([file, n]) => (counts[file] ?? 0) < n)
if (failed) {
  console.error('\nComments are banned. Put decisions in docs/adr/, file issues for hacks, delete the rest.')
  process.exit(1)
}
if (lowered.length) {
  console.log(`Fewer comments than the baseline in ${lowered.length} file(s). Run "pnpm lint:comments --update" to lock it in.`)
}
console.log('lint:comments ok')
