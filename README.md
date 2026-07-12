# Taper to Zero

A small personal app for tracking a 10-day cannabis taper (Jul 12–22, 2026), then counting days at zero.

## How it works

- **Single file, no build step.** Everything lives in `index.html` — open it in a browser and it runs.
- **Data stays on-device.** Daily hit counts are stored in `localStorage` under keys like `ttz-2026-7-12` (one per day). Nothing leaves the browser.
- **The schedule is hardcoded** in the `phases` array in the script: six phases stepping the daily cap down 14 → 11 → 8 → 5 → 2–3 → 0, each with its own session rules.
- After the zero date, the today card flips to a "days off" counter and past days render as `clean`.

## Running it

Open `index.html` directly, or serve it locally:

```sh
python3 -m http.server 8000
```

## The three rules

1. The cap is a ceiling, not a target — it only moves down.
2. Every urge waits 20 minutes before it counts.
3. Every hit gets logged.
