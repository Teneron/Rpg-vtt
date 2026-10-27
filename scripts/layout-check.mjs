// Verificacao automatica de layout (Parte A do plano "Layout + Nivel inicial").
// Uso: npm run build && npm run server (porta 3001) em outro terminal, depois:
//   node scripts/layout-check.mjs [url]   (padrao: http://localhost:3001)
// Usa o Chrome/Edge instalado (playwright-core, sem baixar navegadores).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const URL = process.argv[2] || 'http://localhost:3001';
const OUT = path.resolve('scripts', 'layout-shots');
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
    [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080],
];

const EXECS = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = EXECS.find(p => fs.existsSync(p));

const failures = [];
const fail = (msg) => { failures.push(msg); console.log('  FAIL', msg); };

const browser = await chromium.launch({ executablePath, headless: true });

async function enterAsHost(page) {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.getByText('Criar Sala como Mestre').first().click();
    // senha do mestre (pode nao existir dependendo da versao do fluxo)
    const pwd = page.locator('input[type="password"]').first();
    if (await pwd.waitFor({ timeout: 4000 }).then(() => true).catch(() => false)) {
        await pwd.fill('mestre');
        await page.getByRole('button', { name: /^entrar$/i }).first().click();
    }
    const nameInput = page.getByPlaceholder(/seu nome/i).first();
    await nameInput.waitFor({ timeout: 5000 });
    await nameInput.fill('Mestre Teste');
    await page.getByRole('button', { name: /abrir sala/i }).first().click();
    await page.waitForTimeout(1500);
    const startBtn = page.getByRole('button', { name: /iniciar sess/i }).first();
    if (await startBtn.waitFor({ timeout: 5000 }).then(() => true).catch(() => false)) {
        await startBtn.click();
    }
    await page.waitForSelector('.app-header', { timeout: 15000 }).catch(() => { });
}

async function measure(page, label) {
    const res = await page.evaluate(() => {
        const vw = window.innerWidth, vh = window.innerHeight;
        const de = document.documentElement;
        const out = { vw, vh, scrollW: de.scrollWidth, scrollH: de.scrollHeight, outside: [], overlaps: [] };
        const sel = '.app-header button, .app-header .room-code-badge, .map-floating-toolbar button, .sidebar-floating-toggle, .chat-toggle-btn, .chat-window';
        const rects = [];
        document.querySelectorAll(sel).forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            const name = (el.getAttribute('title') || el.className || el.tagName).toString().slice(0, 40);
            if (r.left < -1 || r.top < -1 || r.right > vw + 1 || r.bottom > vh + 1) out.outside.push(name);
            rects.push({ name, r, el });
        });
        const overlays = ['.map-floating-toolbar', '.sidebar-floating-toggle', '.chat-window', '.chat-toggle-btn'];
        const boxes = overlays.map(s => [s, document.querySelector(s)]).filter(([, e]) => e).map(([s, e]) => [s, e.getBoundingClientRect()]);
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i][1], b = boxes[j][1];
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) out.overlaps.push(`${boxes[i][0]} x ${boxes[j][0]}`);
        }
        const sb = document.querySelector('.sidebar-panel:not(.collapsed)');
        if (sb) {
            const sr = sb.getBoundingClientRect();
            out.sidebar = { w: Math.round(sr.width), h: Math.round(sr.height), childOverflow: [...sb.children].some(c => c.getBoundingClientRect().bottom > sr.bottom + 1) };
        }
        return out;
    });
    console.log(`[${label}] ${res.vw}x${res.vh} sidebar=${JSON.stringify(res.sidebar || null)}`);
    if (res.scrollW > res.vw + 1) fail(`${label}: scroll horizontal (${res.scrollW} > ${res.vw})`);
    if (res.scrollH > res.vh + 1) fail(`${label}: scroll vertical (${res.scrollH} > ${res.vh})`);
    res.outside.forEach(n => fail(`${label}: fora da viewport -> ${n}`));
    res.overlaps.forEach(n => fail(`${label}: sobreposicao -> ${n}`));
    if (res.sidebar?.childOverflow) fail(`${label}: conteudo da sidebar ultrapassa o painel`);
}

try {
    for (const [w, h] of VIEWPORTS) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h } });
        const page = await ctx.newPage();
        const label = `${w}x${h}`;
        try {
            await enterAsHost(page);
            const hasHeader = await page.locator('.app-header').count();
            if (!hasHeader) { fail(`[${label}] nao chegou ao tabuleiro; ajuste o fluxo de entrada`); await page.screenshot({ path: path.join(OUT, `${label}-lobby.png`) }); }
            else {
                for (const tab of ['dice', 'combat', 'gm-screen']) {
                    const title = { dice: 'Dados', combat: 'Combate', 'gm-screen': 'Painel GM' }[tab];
                    await page.locator(`.nav-tab[title="${title}"]`).click().catch(() => { });
                    await page.waitForTimeout(250);
                    await measure(page, `${label}/${tab}`);
                }
                await page.locator('.chat-toggle-btn').click().catch(() => { });
                await page.waitForTimeout(300);
                await measure(page, `${label}/chat-aberto`);
                await page.screenshot({ path: path.join(OUT, `${label}.png`) });
            }
        } catch (e) {
            fail(`${label}: erro de execucao -> ${e.message.split('\n')[0]}`);
            await page.screenshot({ path: path.join(OUT, `${label}-erro.png`) }).catch(() => { });
        }
        await ctx.close();
    }
} finally {
    await browser.close();
}

console.log(failures.length ? `\n${failures.length} falha(s)` : '\nLayout OK em todas as viewports');
process.exit(failures.length ? 1 : 0);
