---
name: land
description: >-
  Land Knihovna changes on the main branch of jsedlacek/knihovna on GitHub.
  Invoke only when the user explicitly requests landing or merging the changes,
  not for review, preparation, passing checks, or skill installation.
disable-model-invocation: true
metadata:
  delta-action: land
---

# Land Knihovna changes

An explicit invocation authorizes the workflow below. Proceed without asking
again whether to commit or push. Installation alone is not a landing request.

## Preflight

- Work only in the current repository checkout. Read applicable `AGENTS.md`,
  `AGENT.md`, contribution instructions, and submission policies. Preserve any
  applicable signing, authorship, review, testing, and submission requirements.
- Inspect `git status --short`, staged and unstaged diffs, current branch, and
  `git remote -v`. Identify the source remote whose destination is
  `github.com/jsedlacek/knihovna`; never publish through `local`. Stop if the
  destination or requested change scope is ambiguous.
- Confirm Git and authenticated GitHub CLI access. Use
  `gh repo view jsedlacek/knihovna --json defaultBranchRef,viewerPermission`
  and check current destination rules with
  `gh api repos/jsedlacek/knihovna/branches/main` and
  `gh api repos/jsedlacek/knihovna/rules/branches/main`.
  If classic protection is enabled, also inspect its protection endpoint.
  An API error is not evidence that rules are absent.
- The approved target is `main`, using a direct fast-forward push. Recheck that
  this is still the intended default branch and that direct pushes are permitted.
  If a pull request, merge queue, signature, review, or another unmet requirement
  prevents this workflow, stop and report the blocker; do not use an admin bypass
  or change repository settings.
- Fetch `main` from the verified source remote. Inspect the commits and complete
  diff between its fetched tip and the current change. Preserve existing commits.
  The fetched target must be an ancestor of the candidate commit. If it already
  contains the requested commits, verify that fact rather than pushing again.
  Otherwise stop on divergence or conflicts: the user expects conflict-free
  landing. Do not rebase, resolve conflicts, reset, or force-push automatically.

## Prepare and verify

- Preserve unrelated files, staged changes, and commits. If requested work cannot
  be separated safely, ask about its scope. Do not stash, discard, or include
  unrelated work. Stage explicit paths rather than everything indiscriminately.
- Use Node 24 and the exact `packageManager` version in `package.json`; check
  `engines` and the current CI definitions rather than relying on installed tools
  alone. Do not silently change the machine's global toolchain.
- Run `pnpm install --frozen-lockfile`.
  Source: `.github/workflows/ci.yml`, Install dependencies; version requirements
  are in `package.json` and the workflow's Setup Node.js step.
  A lockfile mismatch is a blocker, not permission to update dependency versions.
- If build data is missing, run
  `CI=true node scripts/generate-mock-data.js`. This creates missing mock data
  without overwriting existing files. Confirm the files needed for the build
  exist afterward; do not scrape live services to prepare a landing.
  Sources: `scripts/generate-mock-data.js`, `main` and its existence guards;
  `.github/workflows/ci.yml`, Generate mock data for CI.
- Run `pnpm check` after every change and before each new commit.
  Sources: `AGENTS.md`, Agent Instructions; `package.json`, `scripts.check`
  (typecheck, lint, import validation, format check, and tests).
  For failures, make only clearly in-scope fixes, then repeat verification;
  otherwise report the blocker.
- For dependency, application, or build-configuration changes, also run
  `pnpm build` and `pnpm storybook:build`. Sources: `package.json`,
  `scripts.build` and `scripts.storybook:build`; `.github/workflows/deploy.yml`,
  Build site; `.github/workflows/storybook.yml`, Build Storybook.
  Set `CI=true` and `STORYBOOK_DISABLE_TELEMETRY=1` for non-interactive
  Storybook builds. A failed build is not a pass; inspect and address the cause,
  then rerun. Do not overwrite real data or delete unrelated output to retry.
- Inspect generated tracked changes and `git diff --check`. Include only
  intentional generated changes. If files change after verification, rerun the
  applicable checks on the final contents.
- Commit requested uncommitted increments immediately after successful
  `pnpm check`, using explicit paths and
  `GIT_EDITOR=true git commit -m "Descriptive imperative subject"`.
  Sources: `AGENTS.md`, Agent Instructions; repository history uses descriptive
  imperative subjects and does not require a special commit prefix.
  Do not amend or rewrite existing commits merely to land them.
- Record the final candidate SHA. All required local checks must have passed for
  its exact contents. Inspect required GitHub checks and reviews for that SHA
  under the current destination rules before landing. Pending, failing, missing,
  or unverifiable required checks are blockers. Do not substitute an earlier
  commit's results or use the ability to bypass rules as approval.
  The unprotected direct-push workflow currently has no required pre-push remote
  checks; ordinary main-branch workflow runs occur after publication.

## Push and confirm

- Recheck remote rules and the current GitHub target immediately before
  publication. If it advanced beyond the candidate's ancestry, stop instead of
  merging or rewriting history. Never overwrite unrelated remote changes.
- Push the verified candidate SHA to `refs/heads/main` on the verified source
  remote, without force. Use an explicit SHA and destination ref so an unrelated
  checked-out branch cannot be published accidentally. Do not push to `local`.
  A rejected push is a blocker, not permission to retry with force.
- Verify the GitHub branch SHA with `git ls-remote` or the GitHub branch API.
  Confirm it equals the candidate, or, if another update followed, prove the
  candidate is an ancestor of the new tip. Do not report success based solely on
  a local commit or a push command that started but did not finish.
- Inspect GitHub Actions runs for the published SHA using `gh run list` and
  `gh run view`; use bounded, non-interactive monitoring when waiting.
  Sources: `.github/workflows/ci.yml` and `.github/workflows/storybook.yml`
  trigger on pushes to `main`; `.github/workflows/deploy.yml` triggers Deploy
  after CI. These workflows may publish to GitHub Pages and Cloudflare.
  Do not separately invoke deployment, publish packages, or expose credentials.
- Report the destination and landed SHA, verification results, and CI/deployment
  results separately. Pending or failing post-push automation is not successful
  automation, even when the commits are already on GitHub. If blocked before
  publication, explicitly say the changes have not landed and explain why.
- Leave the primary local checkout and unrelated branches untouched. Do not
  delete branches or alter repository protections as cleanup.
