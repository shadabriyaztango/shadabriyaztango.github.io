# Pin

A one-tap way to send a Bangalore location on WhatsApp, from a phone or a desktop.

Live at `/pin/` on the site. Installable — "Add to Home Screen" gives it its own icon
and it runs offline (the map needs a connection; everything else doesn't).

## How it works

Pick an area (or tap the map, or type coordinates), then **Send on WhatsApp**. That
opens WhatsApp with a Google Maps link to that point already in the message box —
pick a chat and send. WhatsApp expands the link into a map thumbnail.

- **Drift** adds a small random offset to each send, so repeated sends don't carry
  byte-identical coordinates. `EXACT` turns it off.
- **Save as my default** remembers a pin for next launch.
- **Caption** and **phone number** are optional; the number skips the chat picker.

## What it can't do

It sends a *link*, not WhatsApp's native blue location card. No web page can fake that
card — WhatsApp reads GPS from the OS. For the native card, Android's built-in mock
location setting is the route; the app's "Fine print" section walks through it.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup |
| `pin.css` | Styling — shares the portfolio's type and palette |
| `pin.js` | Areas, drift, WhatsApp link building, and a small self-contained slippy map |
| `sw.js` | Offline app shell. Bump `CACHE` when a cached file changes |
| `manifest.webmanifest` | PWA metadata |

No dependencies and no build step. The map is ~150 lines of Web Mercator maths over
OpenStreetMap raster tiles, so there's no library to load.

## Note on the two service workers

The site now runs two: `/sw.js` for the portfolio and `/pin/sw.js` for this app. The
Cache Storage API is origin-wide, so each one's `activate` handler only deletes caches
carrying its own prefix (`srt-portfolio-` / `pin-`). Dropping that filter makes the two
workers evict each other on every activation.
