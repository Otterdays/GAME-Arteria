/**
 * Info Scraper — Express server + Playwright scrape API.
 * [TRACE: tools/info_scraper/docs/OVERVIEW.md]
 */

import express from 'express';
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3847;
const OUTPUT_DIR = join(__dirname, 'output');

const MAIN_CONTENT_SELECTORS = [
  '#mw-content-text',
  '.mw-parser-output',
  'article',
  'main',
  '[role="main"]',
  '.content',
  '.post-content',
  '.article-content',
  '#content',
  '.main-content',
];

function formatHtml(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/>\s+</g, '>\n<')
    .trim();
}

function htmlToMarkdown(html) {
  try {
    const td = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });
    td.remove(['script', 'style', 'nav', 'header', 'footer', 'aside', 'noscript']);
    let md = td.turndown(html);
    md = md
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+|\s+$/gm, '')
      .trim();
    return md || fallbackHtmlToText(html);
  } catch {
    return fallbackHtmlToText(html);
  }
}

function fallbackHtmlToText(html) {
  const stripped = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return stripped || '(No content extracted)';
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, 'public')));

app.post('/api/scrape', async (req, res) => {
  const { url, extractMain = true, format = 'html' } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing or invalid url' });
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid URL format' });
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ ok: false, error: 'URL must be http or https' });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const title = await page.title();

    let content = await page.content();
    if (extractMain) {
      for (const sel of MAIN_CONTENT_SELECTORS) {
        try {
          const el = await page.$(sel);
          if (el) {
            const inner = await el.innerHTML();
            await el.dispose();
            if (inner && inner.length > 100) {
              content = inner;
              break;
            }
          }
        } catch {
          continue;
        }
      }
    }

    await browser.close();

    content = formatHtml(content);
    const markdown = htmlToMarkdown(content);

    res.json({
      ok: true,
      url,
      title,
      html: content,
      markdown,
      extracted: extractMain,
    });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ ok: false, error: err.message || 'Scrape failed' });
  }
});

app.post('/api/save', async (req, res) => {
  const { filename, content, format = 'html' } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ ok: false, error: 'Missing filename or content' });
  }
  const ext = format === 'markdown' ? 'md' : 'html';
  const safe = filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const filepath = join(OUTPUT_DIR, `${safe}.${ext}`);
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    await writeFile(filepath, content, 'utf-8');
    res.json({ ok: true, path: filepath });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || 'Save failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Info Scraper running at http://localhost:${PORT}`);
});
