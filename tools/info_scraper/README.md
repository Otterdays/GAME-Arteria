# Info Scraper

> Lightweight web scraper with a minimal GUI. Fetch a URL, extract content, and save it to the project.

## Quick Start

```bash
cd tools/info_scraper
npm install
npx playwright install chromium
npm start
```

Then open **http://localhost:3847** in your browser.

## Usage

1. Enter a URL in the input field.
2. Toggle **Extract main content** (default on) to grab only the article body (MediaWiki, `article`, `main`, etc.).
3. Choose **HTML** or **Markdown** for the preview.
4. Click **Scrape**.
5. Select save format (HTML or Markdown) and click **Save** to write to `output/`.

## Output

- Default output folder: `tools/info_scraper/output/`
- Files are named by domain + slug (e.g. `example-com_page.html`).
- You can configure the output path in the GUI.

## Docs

See `docs/` for detailed documentation.
