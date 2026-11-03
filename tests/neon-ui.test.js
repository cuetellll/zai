'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../src/renderer/neon.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/renderer/neon.css'), 'utf8');
const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');

test('Electron loads the redesigned interface and keeps the renderer bridge controls', () => {
    assert.match(main, /renderer', 'neon\.html'/);
    for (const id of ['btn-power', 'st-head', 'st-sub', 'chip-uptime', 'chip-live',
        'pill-setup', 'pill-cert', 'pill-traffic', 'cert-cn', 'cert-exp', 'cert-sha',
        'spd-down', 'spd-up', 'tot-down', 'tot-up', 'log', 'btn-log-toggle',
        'btn-min', 'btn-max', 'btn-hide', 'toast', 'step-mint', 'step-trust']) {
        assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, id);
    }
    for (const action of ['setup', 'trust', 'remove', 'openfile']) {
        assert.match(html, new RegExp(`data-act="${action}"`));
    }
});
test('motion respects reduced-motion preference and security warning is visible', () => {
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(html, /صاحب کلید/);
    assert.match(html, /دسترسی به سایت‌ها را تضمین نمی‌کند/);
    assert.match(html, /aria-live="polite"/);
});
test('certificate work lives in its own section behind the dock navigation', () => {
    for (const view of ['view-home', 'view-cert', 'view-logs']) {
        assert.equal((html.match(new RegExp(`id="${view}"`, 'g')) || []).length, 1, view);
    }
    for (const target of ['home', 'cert', 'logs']) {
        assert.match(html, new RegExp(`data-view-btn="${target}"`));
    }
    // the certificate nudge on the main screen links to the certificate section
    assert.match(html, /id="cert-cta"/);
    // the typed brand title and its blinking caret
    assert.match(html, /id="brand-type"/);
    assert.match(html, /class="caret"/);
    assert.match(css, /caretBlink/);
    // palette stays red-orange on deep black
    assert.match(css, /--bg:\s*#050505/);
    assert.match(css, /--accent:\s*#FF4500/);
});
