const urlInput = document.getElementById('url');
const scrapeBtn = document.getElementById('scrape');
const saveBtn = document.getElementById('save');
const saveFormat = document.getElementById('saveFormat');
const extractMain = document.getElementById('extractMain');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('preview-placeholder');
const statusEl = document.getElementById('status');

let lastResult = null;

function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status' + (type ? ` ${type}` : '');
  statusEl.style.display = msg ? 'block' : 'none';
}

function slugFromUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/\./g, '-');
    const path = (u.pathname.slice(1) || 'page').replace(/\//g, '_').slice(0, 60);
    return `${host}__${path}`;
  } catch {
    return 'scraped';
  }
}

function getPreviewContent(data, format) {
  let content = data.html;
  if (format === 'markdown') content = data.markdown;
  if (format === 'text') content = data.text;
  
  if (!content) return '';
  if (content.length > 50000) return content.slice(0, 50000) + '\n\n… (truncated)';
  return content;
}

scrapeBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    setStatus('Enter a URL.', 'error');
    return;
  }
  const format = document.querySelector('input[name="format"]:checked')?.value || 'text';
  scrapeBtn.disabled = true;
  setStatus('Scraping…', 'loading');
  preview.textContent = '';
  placeholder.style.display = 'block';
  saveBtn.disabled = true;

  try {
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        extractMain: extractMain.checked,
        format,
      }),
    });
    const data = await res.json();

    if (!data.ok) {
      setStatus(data.error || 'Scrape failed', 'error');
      return;
    }

    lastResult = data;
    const displayContent = getPreviewContent(data, format);
    preview.textContent = displayContent;
    preview.className = 'preview' + (format === 'markdown' ? ' preview-md' : '');
    saveFormat.value = format;
    placeholder.style.display = 'none';
    saveBtn.disabled = false;
    const extracted = data.extracted ? ' (main content)' : '';
    setStatus(`Fetched: ${data.title || url}${extracted}`, 'success');
  } catch (err) {
    setStatus(err.message || 'Request failed', 'error');
  } finally {
    scrapeBtn.disabled = false;
  }
});

saveBtn.addEventListener('click', async () => {
  if (!lastResult) return;
  const format = saveFormat.value;
  let content = lastResult.html;
  if (format === 'markdown') content = lastResult.markdown;
  if (format === 'text') content = lastResult.text;
  
  if (!content && format === 'markdown' && lastResult.html) {
    content = lastResult.html;
  }
  if (!content) {
    setStatus('No content to save. Scrape again.', 'error');
    return;
  }
  
  saveBtn.disabled = true;
  setStatus('Saving…', 'loading');

  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: slugFromUrl(lastResult.url),
        content,
        format,
      }),
    });
    const data = await res.json();

    if (!data.ok) {
      setStatus(data.error || 'Save failed', 'error');
      return;
    }

    setStatus(`Saved to ${data.path}`, 'success');
  } catch (err) {
    setStatus(err.message || 'Request failed', 'error');
  } finally {
    saveBtn.disabled = false;
  }
});