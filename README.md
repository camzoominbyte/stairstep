# Taper to Zero

A small personal PWA for tracking a 10-day cannabis taper (Jul 12–22, 2026), then counting days at zero. Installable on iPhone via Safari → Share → Add to Home Screen.

## How it works

- **Single page, no build step.** All app logic lives in `index.html`; `sw.js` + `manifest.webmanifest` make it an installable, offline-capable PWA. Fonts and icons are self-hosted.
- **Data stays on-device.** Everything is stored in `localStorage` under the `ttz2` key — nothing leaves the phone. A backup can be copied/imported from the "Backup & data" section in the app.
- **Days end at 4am**, so a 1am session counts toward the evening it belongs to.

## Features

- Daily hit tally against a stepping-down cap (14 → 11 → 8 → 5 → 2–3 → 0)
- Per-hit timestamps drive the session rules ("max 3 hits/session · 3h between") — the today card shows when the next session opens
- Working 20-minute urge delay timer (survives app close/reopen)
- Flexible schedule: after an over-cap day the app offers to hold the current phase one extra day, pushing all later steps and the zero date back
- Post-zero slip logging with slip-resilient counters (current run, total clean days, best run — a slip never wipes the total)
- Nightly check-in (sleep / mood / cravings, 1–5) from the final taper phase onward, with trend chart and insights
- Flexible in both directions: a day already lived at the next cap can end its step a day early, pulling zero closer
- "The story" capstone card in the zero era — the whole taper in numbers, shareable
- Optional money-saved tracking (set a rough cost per hit in the trend detail)
- Every chart is tap-to-expand (⤢) into a full-screen, fully labeled version — hour histogram, day punchcard, pace, avoided, day-vs-cap, nightly check-ins, and session gaps; swipe sideways (or tap the dots) to page between them, and lines draw themselves in
- Rotate the phone for the cockpit: a full-bleed six-tile live dashboard (today, taper score ring, next-window countdown, urge timer, the week, zero day) — every tile taps through to its detail page
- Tap any history row to correct its count
- Copy/import JSON backup, share-sheet backup export, and a backup step in the zero-eve ritual

## Deploying

Served from GitHub Pages (root of `main`). When changing `index.html`, bump `CACHE` in `sw.js` so installed phones pick up the update.

## Local dev

```sh
python3 -m http.server 8642
```
