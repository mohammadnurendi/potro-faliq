/* Run with Playwright available in NODE_PATH; serves the local site separately. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');

let baseURL = process.env.QA_URL;
const output = path.resolve(process.env.QA_OUTPUT || 'qa-output');
const sizes = process.env.QA_SIZES ? process.env.QA_SIZES.split(',').map(size => size.split('x').map(Number)) : [
  [320, 568], [360, 640], [375, 667], [390, 844], [393, 852],
  [412, 915], [430, 932], [568, 320], [667, 375], [844, 390],
  [932, 430], [768, 1024], [1024, 768], [1440, 900]
];

async function auditLayout(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const outside = [];
    const clipped = [];
    const selectors = '.wordmark,.hero-copy,h1,h2,.expertise-grid article,.journey-item,.gallery-card,.education-row,.contact-button,.contact-direct a,.site-footer';
    document.querySelectorAll(selectors).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.left < -2 || r.right > width + 2)) outside.push(`${el.tagName}.${el.className}`);
    });
    document.querySelectorAll('h1,h2,h3,.hero-kicker,.contact-button,.filter-chip').forEach(el => {
      if (el.clientWidth && el.scrollWidth > el.clientWidth + 3) clipped.push(el.textContent.trim());
    });
    const heroTitle = document.querySelector('h1').getBoundingClientRect();
    const header = document.querySelector('.site-header').getBoundingClientRect();
    const image = document.querySelector('.hero-portrait');
    return {
      width, scrollWidth: document.documentElement.scrollWidth, outside, clipped,
      titleBelowHeader: heroTitle.top >= header.bottom - 1,
      portraitLoaded: image.complete && image.naturalWidth > 0
    };
  });
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const root = path.resolve(__dirname, '..');
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf' };
  const server = baseURL ? null : http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404).end(); }
  });
  if (server) {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseURL = `http://127.0.0.1:${server.address().port}`;
  }
  const browser = await chromium.launch({ channel: process.env.QA_CHANNEL || 'msedge', headless: true });
  const reports = [];
  try {
    for (const [width, height] of sizes) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 1100, hasTouch: width < 1100, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const layout = await auditLayout(page);
      reports.push({ size: `${width}x${height}`, ...layout, errors });
      assert(layout.scrollWidth <= width + 1, `Page overflow at ${width}x${height}`);
      assert.deepEqual(layout.outside, [], `Content outside viewport at ${width}x${height}`);
      assert.deepEqual(layout.clipped, [], `Clipped text at ${width}x${height}`);
      assert(layout.titleBelowHeader, `Hero overlaps header at ${width}x${height}`);
      assert(layout.portraitLoaded, 'Hero image must load');
      assert.deepEqual(errors, [], 'JavaScript error');
      if ([320, 390, 844, 1440].includes(width)) {
        await page.screenshot({ path: path.join(output, `home-${width}.png`) });
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `contact-${width}.png`) });
      }
      // The last mobile menu link must remain reachable in short landscape viewports.
      if (width <= 1100) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.locator('#menuToggle').click();
        await page.locator('#mobileMenu a').last().scrollIntoViewIfNeeded();
        await page.locator('#mobileMenu a').last().click();
        assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('body').evaluate(el => el.style.position), '');
      }
      await page.locator('.gallery-card').first().click();
      await page.locator('#modalImage').evaluate(img => img.decode());
      await page.locator('#modalOpenFile').scrollIntoViewIfNeeded();
      const link = await page.locator('#modalOpenFile').boundingBox();
      assert(link.x >= 0 && link.x + link.width <= width + 1, `Modal link fits at ${width}x${height}`);
      assert(link.y >= 0 && link.y + link.height <= height + 1, `Modal content reachable at ${width}x${height}`);
      const closeButton = await page.locator('.modal-close').boundingBox();
      if (width <= 840 || (width <= 1100 && height <= 500)) {
        assert(closeButton.y >= 0 && closeButton.y + closeButton.height <= height, `Modal close reachable at ${width}x${height}`);
      }
      await page.locator('.modal-close').click();
      await context.close();
      console.log(`PASS layout ${width}x${height}`);
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.locator('#menuToggle').click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#mobileMenu')).visibility === 'visible');
    await page.locator('#mobileMenu a').last().focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menuToggle');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#contact');
    await page.locator('.wordmark').click();
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'), 'false');
    await page.waitForFunction(() => !document.querySelector('#chapterWipe').classList.contains('is-playing'));
    assert.equal(await page.locator('#waLink use').getAttribute('href'), 'assets/icons.svg#whatsapp');
    assert.equal(await page.locator('#instagramLink use').first().getAttribute('href'), 'assets/icons.svg#instagram');
    await page.locator('[data-filter="organisasi"]').click();
    assert.equal(await page.locator('.gallery-card').count(), 1);
    await page.locator('[data-filter="all"]').click();
    assert.equal(await page.locator('.gallery-card').count(), 5);
    await page.locator('.gallery-card').first().scrollIntoViewIfNeeded();
    const scrollBeforeModal = await page.evaluate(() => window.scrollY);
    await page.locator('.gallery-card').first().click();
    await page.locator('#modalImage').evaluate(img => img.decode());
    assert.equal(await page.locator('.modal-thumb').count(), 3);
    assert.equal(await page.locator('body').evaluate(el => el.style.position), 'fixed');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#detailModal')).opacity === '1');
    await page.screenshot({ path: path.join(output, 'gallery-mobile.png'), animations: 'disabled' });
    await page.locator('#modalNext').click();
    assert.equal(await page.locator('#modalCount').textContent(), '02 / 03');
    await page.locator('.modal-thumb').last().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#modalCount').textContent(), '03 / 03');
    assert(await page.locator('#modalThumbs').evaluate(el => el.contains(document.activeElement)), 'Thumbnail keeps keyboard focus after changing image');
    // A swipe works without interfering with ordinary vertical scrolling.
    await page.locator('.modal-stage').dispatchEvent('touchstart', { touches: [{ identifier: 0, clientX: 280, clientY: 200 }] });
    await page.locator('.modal-stage').dispatchEvent('touchend', { changedTouches: [{ identifier: 0, clientX: 120, clientY: 205 }] });
    assert.equal(await page.locator('#modalCount').textContent(), '01 / 03');
    await page.locator('.modal-stage').dispatchEvent('touchstart', { touches: [{ identifier: 0, clientX: 240, clientY: 200 }] });
    await page.locator('.modal-stage').dispatchEvent('touchend', { changedTouches: [{ identifier: 0, clientX: 190, clientY: 400 }] });
    assert.equal(await page.locator('#modalCount').textContent(), '01 / 03');
    await page.locator('#modalOpenFile').scrollIntoViewIfNeeded();
    assert(await page.locator('.modal-close').isVisible());
    const close = await page.locator('.modal-close').boundingBox();
    assert(close.y >= 0 && close.y + close.height <= 844, 'Close remains reachable after scrolling modal');
    await page.locator('.modal-close').click();
    assert.equal(await page.locator('body').evaluate(el => el.style.position), '');
    assert(Math.abs(await page.evaluate(() => window.scrollY) - scrollBeforeModal) <= 2, 'Restore previous scroll position');
    await page.locator('#certNext').click();
    assert.equal(await page.locator('#certCount').textContent(), '02 / 08');
    await page.locator('#certPrev').click();
    await page.locator('#certOpen').click();
    await page.locator('#modalImage').evaluate(img => img.decode());
    assert(await page.locator('.modal-panel').evaluate(el => el.classList.contains('portrait-media')));
    await page.locator('#modalOpenFile').scrollIntoViewIfNeeded();
    assert.match(await page.locator('#modalOpenFile').getAttribute('href'), /original\/certificate-14\.jpeg$/);
    await page.screenshot({ path: path.join(output, 'certificate-mobile.png'), animations: 'disabled' });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#detailModal').getAttribute('aria-hidden'), 'true');
    assert.deepEqual(errors, []);
    await context.close();
    reports.push({ interactions: 'PASS: menu, keyboard focus loop, logo navigation, filters, gallery, thumbnails, swipe direction, certificate, scroll restoration, close controls', errors });
    console.log('PASS interactions (menu, keyboard, filters, gallery, swipe, certificate, scroll restoration)');
  } finally {
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(reports, null, 2));
    await browser.close();
    server?.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
