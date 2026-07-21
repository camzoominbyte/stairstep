# Taper to Zero

A small personal PWA for tracking a 10-day cannabis taper (Jul 12–22, 2026), then counting days at zero. Installable on iPhone via Safari → Share → Add to Home Screen.

## How it works

- **Single page, no build step.** All app logic lives in `index.html`; `sw.js` + `manifest.webmanifest` make it an installable, offline-capable PWA. Fonts and icons are self-hosted.
- **Data stays on-device.** Everything is stored in `localStorage` under the `ttz2` key — nothing leaves the phone. A backup can be copied/imported from the "Backup & data" section in the app.
- **Days end at 4am**, so a 1am session counts toward the evening it belongs to.

## Features

- Daily hit tally against a stepping-down cap, visualized as a colour-coded descent (warm amber at a high cap → sage at zero) that the phase cards and hero number share
- Per-hit timestamps drive the session rules ("max 3 hits/session · 3h between") — the today card shows when the next session opens
- Timestamps are on the surface, not buried: every day timeline stamps each sitting with its clock time, and a "Yesterday" card on the Today screen spells out the prior day's sittings and the gaps between them
- The longest gap is the headline stat — lit across the day's timeline, badged in the gap list, and compared against the previous logged day's longest everywhere a day appears (the Yesterday card also tracks the stretch running right now against yesterday's best)
- Working 20-minute urge delay timer (survives app close/reopen)
- Self-adjusting schedule: an over-cap day automatically holds its phase one extra day, pushing all later steps and the zero date back in real time (the banner lets you decline and keep the original dates); a failed step-down defers — the day rides its old cap and the drop retries tomorrow; every two hard days at one cap ease the next step by an extra base day; and zero eve offers one (only one) planned extra evening-only day while the stash still exists
- "The schedule, and why" on the Plan tab writes that derivation out: every day that held a step, every step-down that deferred, every hold that was declined, every day added by hand — each one reversible from that card, and a manual "this step needs another day" for a rough day that still landed under its cap. Correcting a day's count also drops any stale decline on it, so an answer given once can never silently freeze the descent
- Post-zero slip logging with slip-resilient counters (current run, total clean days, best run — a slip never wipes the total)
- Check-in (sleep / mood / cravings, 1–5 — dots count what there was, so loud cravings are the high number) from the final taper phase onward, with trend chart and insights — nightly through zero day 21, weekly after, and back to nightly for a week after any slip
- The long tail: marker days at 30/60/90/180/365 with planned rewards funded by the money-saved tracker, a stale-backup nudge, and a one-sentence "why" that surfaces during the urge timer and on rough days
- Flexible in both directions: a day already lived at the next cap can end its step a day early, pulling zero closer
- "The story" capstone card in the zero era — the whole taper in numbers, shareable
- Optional money-saved tracking (set a rough cost per hit in the trend detail)
- Every chart is tap-to-expand (⤢) into a full-screen, fully labeled version — hour histogram, day punchcard, pace, avoided, day-vs-cap, nightly check-ins, and session gaps; swipe sideways (or tap the dots) to page between them, and lines draw themselves in
- Rotate the phone for the cockpit: a full-bleed six-tile live dashboard (today, taper score ring, next-window countdown, urge timer, the week, zero day) — every tile taps through to its detail page
- Tap any history row to correct its count
- Copy/import JSON backup, share-sheet backup export, and a backup step in the zero-eve ritual — and every destructive restore can be undone, since the copy it replaced is stashed and now has a button to bring it back

## Deploying

Served from GitHub Pages (root of `main`). When changing `index.html`, bump `CACHE` in `sw.js` so installed phones pick up the update.

## Local dev

```sh
python3 -m http.server 8642
```
