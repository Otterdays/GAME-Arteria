# Info Scraper — API

## POST /api/scrape

Scrape a URL and return its content.

**Request:**
```json
{
  "url": "https://example.com/page",
  "extractMain": true,
  "format": "html"
}
```

- `extractMain` (boolean, default true): Extract main content only (tries #mw-content-text, article, main, etc.).
- `format` (string): Preview format hint; server always returns both `html` and `markdown`.

**Response (success):**
```json
{
  "ok": true,
  "url": "https://example.com/page",
  "title": "Example Page",
  "html": "<div>...",
  "markdown": "# Example...",
  "extracted": true
}
```

**Response (error):**
```json
{
  "ok": false,
  "error": "Navigation timeout"
}
```

## POST /api/save

Save scraped content to disk.

**Request:**
```json
{
  "filename": "example-com_page",
  "content": "<div>...",
  "format": "html"
}
```

- `format`: `"html"` (saves .html) or `"markdown"` (saves .md).

**Response:**
```json
{
  "ok": true,
  "path": "tools/info_scraper/output/example-com_page.html"
}
```
