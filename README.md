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
- Post-zero slip logging and an honest days-off counter
- Tap any history row to correct its count
- Copy/import JSON backup

## Deploying

Served from GitHub Pages (root of `main`). When changing `index.html`, bump `CACHE` in `sw.js` so installed phones pick up the update.

## Local dev

```sh
python3 -m http.server 8642
```
