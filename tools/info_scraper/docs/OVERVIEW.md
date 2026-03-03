# Info Scraper — Overview

> [TRACE: tools/info_scraper/README.md]

## Purpose

A standalone tool to fetch web pages and save their content into the Arteria project. Uses Playwright for full JS rendering; provides a lightweight browser-based GUI instead of a CLI.

## Architecture

```
tools/info_scraper/
├── server.js       # Express server + Playwright scrape API
├── public/         # Static GUI (HTML, CSS, JS)
│   ├── index.html
│   └── app.js
├── output/         # Default save location (gitignored)
├── docs/           # Tool documentation
└── package.json
```

- **Server:** Express on port 3847. Serves `public/` and exposes `/api/scrape` POST.
- **GUI:** Single-page form. User enters URL, clicks Scrape, sees preview, optionally saves.
- **Scrape:** Playwright Chromium headless. Returns HTML + optional text extraction.

## MVP Scope (v0.1)

- [x] One URL at a time
- [x] Scrape and preview in GUI
- [x] Save to `output/` with sanitized filename
- [x] Extract main content (MediaWiki, article, main, etc.)
- [x] Markdown conversion (turndown)
- [x] Formatted output (whitespace, line breaks)
- [ ] Multiple URLs (queue)
- [ ] Custom selectors

## Dependencies

- **express** — HTTP server
- **playwright** — Headless browser (Chromium)

Run `npx playwright install chromium` once after `npm install`.
