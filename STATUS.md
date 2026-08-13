# Project Status

This file is the single source of truth for what is actually built in
Crosspost-ai. "Built" means: merged into `main` on GitHub. If it isn't in
`main`, it doesn't count yet, no matter what a chat session said.

Last verified against `main`: 2026-08-13 (commit `622a97e`, "Initial commit").

## What's actually built

- Nothing yet. The repository currently contains only this file and a
  README with the project name.

## What's in progress

- Nothing is currently on `main`-bound track. Any branch not listed below
  has not been reviewed for mergeable progress.

## What's not started

- The actual Crosspost-ai product (scope TBD - what platforms it posts to,
  what the posting flow looks like, auth, storage, etc.)

## Known history / why this file exists

Multiple prior sessions worked on this repo in isolated cloud containers.
At least one (`claude/eloquent-allen-ai8zth`, June 2026) did work that was
never committed and pushed to GitHub before its container was reclaimed -
so whatever it built is gone and unverifiable. That's the recurring
"I've gotten further than this before" feeling: progress lived in a
session transcript, not in git, and disappeared when the session did.

## Rules for keeping this file honest

1. Nothing counts as "built" until it's pushed to a branch on GitHub and
   ideally merged to `main`.
2. Before ending a session that changed code, commit and push. Every time.
   No exceptions for "I'll finish next session."
3. Update this file in the same commit as the code change it describes.
   Move items between the three sections above instead of writing status
   updates elsewhere (chat, memory, a different doc).
4. If you resume a stale branch, verify what's actually in it (`git log`,
   `git diff main`) before believing it contains what a prior summary
   claimed.
