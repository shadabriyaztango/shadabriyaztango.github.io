# shadabriyaztango.github.io

Personal portfolio site for **Shadab Riyaz Tango** — *Always Exploring*.

A single-page, fully responsive site (desktop + mobile) with a light/dark theme
toggle, scroll-reveal animations, and installable-app (PWA) support.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The page |
| `styles.css` | All styling, including the mobile breakpoint (≤ 719px) |
| `script.js` | Theme toggle + scroll-reveal |
| `manifest.webmanifest` | PWA metadata (name, icons, colors) |
| `sw.js` | Service worker — offline support + installability |
| `assets/shadab.jpeg` | Photo |
| `assets/icon-*.png`, `apple-touch-icon.png` | App icons |

## Deploy (GitHub Pages)

This repo is named `shadabriyaztango.github.io`, so GitHub Pages serves it
automatically at **https://shadabriyaztango.github.io** from the `main` branch root.

1. Push these files to the `main` branch.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main`, folder = `/ (root)`.
3. Give it a minute, then open the URL.

## Install as an app

Once live over HTTPS (GitHub Pages is HTTPS):

- **Desktop (Chrome/Edge):** click the install icon in the address bar → *Install*.
- **Android (Chrome):** menu → *Add to Home screen / Install app*.
- **iPhone (Safari):** Share → *Add to Home Screen*.

## Editing

Everything is plain HTML/CSS/JS — no build step. Edit the files and re-push.
If you change any cached file, bump the `CACHE` version string in `sw.js`
(e.g. `srt-portfolio-v1` → `v2`) so browsers pick up the new version.
