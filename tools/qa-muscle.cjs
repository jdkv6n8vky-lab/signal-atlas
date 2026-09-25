#!/usr/bin/env node
'use strict';

// Development-only browser QA. No package is shipped to, or required by, the site.
// Run with Node and Playwright available through NODE_PATH, or set PLAYWRIGHT_PATH.
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const assert = require('node:assert/strict');

function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_PATH,
    'playwright',
    path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  }
  throw new Error('Playwright is required for browser QA. Set PLAYWRIGHT_PATH or NODE_PATH.');
}

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.QA_OUTPUT || path.join(os.tmpdir(), 'signal-atlas-muscle-qa'));
const pagePath = '/topics/how-muscle-contraction-works.html';
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'narrow-mobile', width: 320, height: 740 },
];
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/favicon.ico') { response.writeHead(204).end(); return; }
      const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403).end('Forbidden'); return;
      }
      const body = await fs.readFile(file);
      response.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      }).end(body);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('File unavailable');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

async function layoutAudit(page) {
  return page.evaluate(() => {
    const visible = element => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden';
    };
    const viewport = document.documentElement.clientWidth;
    const describe = element => element.id ? `#${element.id}` :
      `${element.tagName.toLowerCase()}${element.classList.length ? '.' + [...element.classList].join('.') : ''}`;
    const elements = [...document.body.querySelectorAll('*')];
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    const seen = new Set();
    const duplicateIds = ids.filter(id => seen.has(id) || !seen.add(id));
    const overflow = elements.filter(element => {
      if (!visible(element) || element.closest('svg')) return false;
      const box = element.getBoundingClientRect();
      return box.left < -1 || box.right > viewport + 1;
    }).map(describe);
    const unlabeledControls = elements.filter(element => {
      if (!element.matches('button, input:not([type="hidden"]), select, textarea') || !visible(element)) return false;
      return !(element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') ||
        element.getAttribute('title') || element.textContent.trim() || element.labels?.length);
    }).map(describe);
    const brokenImages = [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src);
    return {
      viewportWidth: viewport, documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth, duplicateIds, overflow, unlabeledControls, brokenImages,
    };
  });
}

async function selectStep(page, index) {
  if (await page.locator('#chapterSelect').isVisible()) {
    await page.selectOption('#chapterSelect', String(index));
  } else {
    await page.locator(`.step-link[data-go="${index}"]`).click();
  }
  await page.waitForFunction(index => window.SignalAtlasMuscle.getState().index === index, index);
}
async function stateOf(page) { return page.evaluate(() => window.SignalAtlasMuscle.getState()); }
async function range(page, selector, value) {
  await page.locator(selector).fill(String(value));
  await page.locator(selector).dispatchEvent('input');
}
async function runInteractions(page, results) {
  const check = async (name, fn) => {
    if (process.env.QA_CHECK_FILTER && !new RegExp(process.env.QA_CHECK_FILTER, 'i').test(name)) return;
    try { await fn(); results.checks.push({ name, passed: true }); }
    catch (error) { results.checks.push({ name, passed: false, error: error.message }); process.exitCode = 1; }
  };
  await check('Every chapter renders, with one current chapter and no horizontal overflow', async () => {
    assert.equal(await page.evaluate(() => window.SignalAtlasMuscle.getStepCount()), 20);
    for (let index = 0; index < 20; index++) {
      await selectStep(page, index);
      assert((await page.locator('#stepTitle').innerText()).length > 5);
      assert.equal(await page.locator('.step-link[aria-current="step"]').count(), 1);
      assert.equal(await page.locator('#mechanismView').isVisible(), index < 17);
      assert.equal(await page.locator('#labControls').isVisible(), index >= 7 && index <= 16);
      const audit = await layoutAudit(page);
      assert(audit.documentWidth <= audit.viewportWidth + 1, `Chapter ${index}: overflow`);
      assert.equal(audit.duplicateIds.length, 0, `Chapter ${index}: duplicate IDs`);
      assert.equal(audit.unlabeledControls.length, 0, `Chapter ${index}: unlabeled controls`);
    }
  });
  await check('Back, next, boundary, keyboard arrows, button Space, restart', async () => {
    await page.locator('#restartBtn').click();
    assert.equal((await stateOf(page)).index, 0);
    assert(await page.locator('#prevBtn').isDisabled());
    await page.locator('#nextBtn').click(); assert.equal((await stateOf(page)).index, 1);
    await page.locator('#prevBtn').click(); assert.equal((await stateOf(page)).index, 0);
    await page.locator('#stepTitle').focus();
    await page.keyboard.press('ArrowRight'); assert.equal((await stateOf(page)).index, 1);
    await page.keyboard.press('ArrowLeft'); assert.equal((await stateOf(page)).index, 0);
    await page.locator('#nextBtn').focus(); await page.keyboard.press('Space');
    assert.equal((await stateOf(page)).index, 1); assert.equal((await stateOf(page)).autoplay, false);
  });
  await check('Autoplay advances after eight seconds, pause freezes motion, Space toggles', async () => {
    await selectStep(page, 0); await page.locator('#playBtn').click();
    assert.equal((await stateOf(page)).autoplay, true);
    await page.waitForFunction(() => window.SignalAtlasMuscle.getState().index === 1, null, { timeout: 11000 });
    await page.locator('#playBtn').click();
    const paused = await stateOf(page); assert.equal(paused.autoplay, false); assert.equal(paused.motion, false);
    await page.waitForTimeout(150); assert.equal((await stateOf(page)).clock, paused.clock);
    await page.locator('#stepTitle').focus(); await page.keyboard.press('Space');
    assert.equal((await stateOf(page)).autoplay, true);
    await page.keyboard.press('Space'); assert.equal((await stateOf(page)).autoplay, false);
  });
  await check('Calcium, force, shortening, fixed filament lengths, bands and keyboard range controls', async () => {
    await selectStep(page, 13); await page.locator('#resetLabBtn').click();
    if ((await stateOf(page)).motion) await page.locator('#motionBtn').click();
    await range(page, '#caSlider', 0); const low = await stateOf(page);
    const geometry = await page.locator('[data-filament-length], [data-thick-filament-length]').evaluateAll(els => els.map(el => ({ length: el.dataset.filamentLength || el.dataset.thickFilamentLength, d: el.querySelector('path')?.getAttribute('d'), x: el.getAttribute('x'), width: el.getAttribute('width') })));
    const lowBands = await page.locator('#band-h').getAttribute('width');
    await range(page, '#caSlider', 100); const high = await stateOf(page);
    assert.equal(low.ca, 0); assert.equal(low.force, 0); assert.equal(low.length, 100);
    assert(high.force > 90); assert(high.length < 80);
    assert(Number(await page.locator('#band-h').getAttribute('width')) < Number(lowBands));
    assert.deepEqual(await page.locator('[data-filament-length], [data-thick-filament-length]').evaluateAll(els => els.map(el => ({ length: el.dataset.filamentLength || el.dataset.thickFilamentLength, d: el.querySelector('path')?.getAttribute('d'), x: el.getAttribute('x'), width: el.getAttribute('width') }))), geometry);
    assert(!/scale/.test(await page.locator('.thin-filament').first().getAttribute('transform')));
    await page.locator('#bandsBtn').click(); assert.equal((await stateOf(page)).bands, false);
    await page.locator('#bandsBtn').click(); assert.equal((await stateOf(page)).bands, true);
    await range(page, '#caSlider', 50); await page.locator('#caSlider').focus(); await page.keyboard.press('ArrowRight');
    assert.equal((await stateOf(page)).ca, 51); assert.equal((await stateOf(page)).index, 13);
    await page.locator('#lowCaPresetBtn').click(); assert.equal((await stateOf(page)).ca, 8);
  });
  await check('ATP depletion locks attached length, low calcium cannot release rigor, restoration and lab reset recover', async () => {
    await selectStep(page, 13); await page.locator('#resetLabBtn').click();
    if ((await stateOf(page)).motion) await page.locator('#motionBtn').click();
    await range(page, '#caSlider', 100); const active = await stateOf(page);
    await page.locator('#atpOff').click(); const depleted = await stateOf(page);
    assert.equal(depleted.atp, false); assert.equal(depleted.rigor, true); assert.equal(depleted.force, 0);
    assert.equal(depleted.length, active.length);
    await range(page, '#caSlider', 0); assert.equal((await stateOf(page)).length, depleted.length);
    await page.locator('#cycleBtn').click(); assert.equal((await stateOf(page)).cycle, false);
    await page.locator('#atpOn').click(); const restored = await stateOf(page);
    assert.equal(restored.rigor, false); assert.equal(restored.length, 100);
    await page.locator('#atpOff').click(); assert.equal((await stateOf(page)).rigor, false);
    assert.equal((await stateOf(page)).length, 100);
    await page.locator('#resetLabBtn').click(); const reset = await stateOf(page);
    assert.equal(reset.atp, true); assert.equal(reset.rigor, false); assert.equal(reset.frequency, 10); assert.equal(reset.ca, 85); assert.equal(reset.run, null);
  });
  await check('All four cross-bridge phases and complete automatic cycle', async () => {
    await selectStep(page, 13); await page.locator('#resetLabBtn').click();
    for (let phase = 0; phase < 4; phase++) {
      await page.locator(`[data-phase="${phase}"]`).click();
      assert.equal((await stateOf(page)).phase, phase);
      assert.equal(await page.locator(`[data-phase="${phase}"]`).getAttribute('aria-current'), 'step');
    }
    await page.locator('#cycleBtn').click(); assert.equal((await stateOf(page)).cycle, true);
    const observed = new Set([0]);
    for (let i = 0; i < 24; i++) { await page.waitForTimeout(260); const state = await stateOf(page); observed.add(state.phase); if (!state.cycle) break; }
    assert.deepEqual([...observed].sort(), [0, 1, 2, 3]);
    assert.equal((await stateOf(page)).cycle, false); assert.equal((await stateOf(page)).cycleTurns, 4);
    await page.locator('#cycleBtn').click(); await page.locator('#cycleBtn').click(); assert.equal((await stateOf(page)).cycle, false);
  });
  await check('Single twitch has calcium before force and relaxes; frequency train produces summation and tetanus', async () => {
    await selectStep(page, 14); await page.locator('#resetLabBtn').click();
    await page.locator('#pulseBtn').click();
    await page.waitForFunction(() => window.SignalAtlasMuscle.getState().modelTime > .4, null, { timeout: 4000 });
    const twitch = await stateOf(page);
    const caPeak = twitch.history.reduce((a, b) => b.ca > a.ca ? b : a);
    const forcePeak = twitch.history.reduce((a, b) => b.force > a.force ? b : a);
    assert(caPeak.t < forcePeak.t); assert(forcePeak.force > 5);
    await range(page, '#freqSlider', 1); await page.locator('#trainBtn').click();
    await page.waitForFunction(() => window.SignalAtlasMuscle.getState().modelTime > .8, null, { timeout: 6000 });
    const low = await stateOf(page);
    await page.locator('#trainBtn').click();
    await range(page, '#freqSlider', 60); await page.locator('#freqSlider').focus(); await page.keyboard.press('ArrowLeft');
    assert.equal((await stateOf(page)).frequency, 59); assert.equal((await stateOf(page)).index, 14);
    await range(page, '#freqSlider', 60); await page.locator('#trainBtn').click();
    await page.waitForFunction(() => window.SignalAtlasMuscle.getState().modelTime > .8, null, { timeout: 6000 });
    const high = await stateOf(page);
    assert(high.force > low.force + 40); assert(high.ca > low.ca + 30);
    assert(high.history.filter(p => p.pulse).length > low.history.filter(p => p.pulse).length);
    await page.waitForFunction(() => !window.SignalAtlasMuscle.getState().run, null, { timeout: 8500 });
    const recovered = await stateOf(page); assert(recovered.ca < 1); assert(recovered.force < 1); assert(recovered.length > 99);
    results.forceComparison = { singleCaPeakTime: caPeak.t, singleForcePeakTime: forcePeak.t, lowHzForce: low.force, highHzForce: high.force };
  });
  await check('Glossary search, no-results state and facts references', async () => {
    await selectStep(page, 17); const total = await page.locator('.reading-card:visible').count(); assert(total > 10);
    await page.locator('#glossarySearch').fill('SERCA'); assert((await page.locator('.reading-card:visible').count()) >= 1);
    assert((await page.locator('.reading-card:visible').count()) < total);
    await page.locator('#glossarySearch').fill('zzznomatchzzz'); assert.equal(await page.locator('.reading-card:visible').count(), 0);
    assert((await page.locator('#searchStatus').innerText()).includes('0 terms'));
    await page.locator('#glossarySearch').fill(''); assert.equal(await page.locator('.reading-card:visible').count(), total);
    await selectStep(page, 18); assert((await page.locator('.reading-card').count()) >= 5); assert((await page.locator('.source-list a').count()) >= 3);
  });
  await check('All checkpoints, incorrect feedback, retry, next, persistence, completion and review', async () => {
    await page.locator('#restartBtn').click(); await selectStep(page, 19);
    const quiz = await page.evaluate(() => window.SignalAtlasMuscleContent.quiz);
    assert.equal(quiz.length, 8);
    await page.locator(`[data-answer="${(quiz[0].correct + 1) % quiz[0].options.length}"]`).click();
    assert.equal(await page.locator('.quiz-option.is-wrong').count(), 1);
    await page.locator('[data-retry]').click(); assert.equal(Object.keys(await page.evaluate(() => window.SignalAtlasMuscle.getAnswers())).length, 0);
    for (let index = 0; index < quiz.length; index++) {
      await page.locator(`[data-answer="${quiz[index].correct}"]`).click();
      assert.equal(await page.locator('.quiz-option.is-correct').count(), 1);
      assert((await page.locator('.quiz-feedback').innerText()).length > 30);
      await page.locator('#quizNextBtn').click();
    }
    assert(await page.locator('[data-review]').isVisible()); assert(await page.locator('#nextBtn').isDisabled());
    await page.locator('[data-review]').click(); assert.equal((await stateOf(page)).index, 19);
    await page.locator('[data-question="4"]').click(); assert.equal(await page.locator('[data-question="4"]').getAttribute('aria-current'), 'step');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(Object.keys(await page.evaluate(() => window.SignalAtlasMuscle.getAnswers())).length, 8);
    await page.locator('#restartBtn').click(); assert.equal(Object.keys(await page.evaluate(() => window.SignalAtlasMuscle.getAnswers())).length, 0);
    assert.equal((await stateOf(page)).index, 0); assert.equal((await stateOf(page)).atp, true);
  });
  await check('Native fullscreen enter and exit', async () => {
    await selectStep(page, 13); await page.locator('#fullBtn').click();
    await page.waitForFunction(() => !!document.fullscreenElement);
    await page.waitForFunction(() => document.getElementById('fullBtn').getAttribute('aria-label') === 'Exit fullscreen');
    assert.equal(await page.locator('#fullBtn').getAttribute('aria-label'), 'Exit fullscreen');
    const audit = await layoutAudit(page); assert(audit.documentWidth <= audit.viewportWidth + 1);
    await page.screenshot({ path: path.join(output, 'desktop-fullscreen.png') });
    await page.locator('#fullBtn').click(); await page.waitForFunction(() => !document.fullscreenElement);
    await page.waitForFunction(() => document.getElementById('fullBtn').getAttribute('aria-label') === 'Enter fullscreen');
    assert.equal(await page.locator('#fullBtn').getAttribute('aria-label'), 'Enter fullscreen');
  });
  await check('Chapter sidebar returns to explanation; header pause stays synchronized with explicit lab playback', async () => {
    await selectStep(page, 13);
    assert.equal(await page.locator('.muscle-guide').evaluate(el => el.scrollTop), 0);
    await page.locator('#restartBtn').click();
    await page.locator('#headerMotionBtn').click();
    assert.equal((await stateOf(page)).motion, false);
    assert.equal(await page.locator('#headerMotionBtn').getAttribute('aria-label'), 'Resume animation');
    await page.locator('#headerMotionBtn').click();
    assert.equal((await stateOf(page)).motion, true);
    await selectStep(page, 13);
    for (const id of ['pulseBtn', 'resetLabBtn', 'cycleBtn']) {
      if ((await stateOf(page)).motion) await page.locator('#headerMotionBtn').click();
      await page.locator(`#${id}`).click();
      assert.equal((await stateOf(page)).motion, true, id);
      await page.waitForFunction(() => document.getElementById('headerMotionBtn').getAttribute('aria-label') === 'Pause animation', null, { timeout: 1000 });
      assert.equal(await page.locator('#headerMotionBtn').getAttribute('aria-label'), 'Pause animation', id);
    }
    await page.locator('#restartBtn').click();
  });
  await check('SERCA recovery lowers calcium and force; ATP depletion stops calcium reuptake', async () => {
    await page.locator('#restartBtn').click(); await selectStep(page, 15);
    const active = await stateOf(page);
    assert.equal(active.mode, 'evoked'); assert.equal(active.run.kind, 'recovery'); assert(active.ca > 20);
    await page.waitForFunction(() => window.SignalAtlasMuscle.getState().modelTime > .3, null, { timeout: 3000 });
    const recovery = await stateOf(page);
    assert(recovery.ca < active.ca / 5); assert(recovery.force < active.force / 2);
    await page.locator('#restartBtn').click(); await selectStep(page, 15); await page.locator('#atpOff').click();
    const depleted = await stateOf(page);
    await page.waitForTimeout(300);
    assert.equal((await stateOf(page)).ca, depleted.ca); assert.equal((await stateOf(page)).atp, false);
    await page.locator('#atpOn').click(); await page.waitForTimeout(300);
    assert((await stateOf(page)).ca < depleted.ca);
    await page.locator('#restartBtn').click();
  });
  await check('Repeated navigation clears active simulations and restart resets all state', async () => {
    for (let iteration = 0; iteration < 3; iteration++) {
      await selectStep(page, 13); await page.locator('#resetLabBtn').click(); await page.locator('#cycleBtn').click();
      await selectStep(page, 6); assert.equal((await stateOf(page)).cycle, false); assert.equal((await stateOf(page)).run, null);
      await selectStep(page, 14); await page.locator('#trainBtn').click();
      await selectStep(page, 17); assert.equal((await stateOf(page)).run, null);
      await selectStep(page, 13); await page.locator('#atpOff').click();
    }
    await page.locator('#restartBtn').click(); const reset = await stateOf(page);
    for (const [key, value] of Object.entries({index: 0, ca: 0, force: 0, length: 100, atp: true, rigor: false, cycle: false, run: null, autoplay: false})) assert.equal(reset[key], value, key);
  });
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const { chromium } = loadPlaywright();
  const { server, origin } = await startServer();
  let browser;
  const results = { origin, output, viewports: [], checks: [], errors: [] };
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } :
        process.platform === 'darwin' ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {}),
    });
    results.browser = browser.version();
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];
      page.on('pageerror', error => consoleErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      await page.goto(origin + pagePath, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const audit = await layoutAudit(page);
      await page.screenshot({ path: path.join(output, `${viewport.name}-viewport.png`) });
      await page.screenshot({ path: path.join(output, `${viewport.name}-full.png`), fullPage: true });
      const entry = { ...viewport, ...audit, consoleErrors, failedRequests, scenes: [] };
      results.viewports.push(entry);
      if (['desktop', 'mobile', 'narrow-mobile'].includes(viewport.name)) {
        for (const [index, scene] of [[6, 'triad'], [13, 'sarcomere']]) {
          await selectStep(page, index);
          await page.screenshot({ path: path.join(output, `${viewport.name}-${scene}-full.png`), fullPage: true });
          entry.scenes.push({ scene, ...(await layoutAudit(page)) });
        }
      }
      for (const [name, passed] of Object.entries({
        'horizontal document overflow': audit.documentWidth <= viewport.width + 1,
        'duplicate IDs': !audit.duplicateIds.length,
        'controls have accessible names': !audit.unlabeledControls.length,
        'images load': !audit.brokenImages.length,
        'browser console is clean': !consoleErrors.length,
        'scene overflow': entry.scenes.every(scene => scene.documentWidth <= viewport.width + 1),
      })) { results.checks.push({name: `${viewport.name}: ${name}`, passed }); if (!passed) process.exitCode = 1; }
      await context.close();
    }
    process.stdout.write(`Screenshots ready: ${output}\n`);
    if (!process.argv.includes('--layout-only')) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const page = await context.newPage();
      const interactionErrors = [];
      page.on('pageerror', error => interactionErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') interactionErrors.push(message.text()); });
      await page.goto(origin + pagePath, { waitUntil: 'networkidle' });
      await runInteractions(page, results);
      results.checks.push({name: 'Interaction console is clean', passed: !interactionErrors.length, errors: interactionErrors });
      if (interactionErrors.length) process.exitCode = 1;
      const fallback = await context.newPage();
      await fallback.goto(origin + pagePath, { waitUntil: 'networkidle' });
      await fallback.evaluate(() => { document.getElementById('module-root').requestFullscreen = () => Promise.reject(new Error('QA simulates unsupported fullscreen')); });
      await fallback.locator('#fullBtn').click();
      assert(await fallback.locator('#module-root').evaluate(el => el.classList.contains('is-expanded')));
      await fallback.keyboard.press('Escape');
      assert.equal(await fallback.locator('#module-root').evaluate(el => el.classList.contains('is-expanded')), false);
      assert.equal(await fallback.evaluate(() => document.body.style.overflow), '');
      results.checks.push({ name: 'Unsupported fullscreen fallback and Escape restore scrolling/focus', passed: true });
      await context.close();
      const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      const reducedPage = await reducedContext.newPage();
      await reducedPage.goto(origin + pagePath, { waitUntil: 'networkidle' });
      assert.equal((await stateOf(reducedPage)).motion, false);
      await selectStep(reducedPage, 13); await range(reducedPage, '#caSlider', 0); assert.equal((await stateOf(reducedPage)).length, 100);
      await range(reducedPage, '#caSlider', 100); assert((await stateOf(reducedPage)).length < 80);
      const frozen = await stateOf(reducedPage); await reducedPage.waitForTimeout(100); assert.equal((await stateOf(reducedPage)).clock, frozen.clock);
      for (let index = 0; index < 20; index++) { await selectStep(reducedPage, index); const audit = await layoutAudit(reducedPage); assert(audit.documentWidth <= 391, `Mobile chapter ${index}: overflow`); }
      results.checks.push({ name: 'Reduced-motion defaults, immediate static lab response, mobile chapter navigation and layout', passed: true });
      await reducedContext.close();
    }

  } catch (error) {
    results.errors.push(error.stack || String(error));
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
    process.stdout.write(JSON.stringify(results, null, 2) + '\n');
  }
}

main().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
