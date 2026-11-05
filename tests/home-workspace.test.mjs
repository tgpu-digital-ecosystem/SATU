import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('multi-business home remains available in Malay, English and Arabic', () => {
  assert.match(app, /satuBusinessWelcome/);
  assert.match(app, /Untuk kedai, servis, makanan/);
  assert.match(app, /For retail, services, food businesses/);
  assert.match(app, /للمتاجر والخدمات والمطاعم/);
  assert.match(app, /setPage\('settings'\)/);
});

test('recent activity does not invent an invoice when the list is empty', () => {
  assert.match(app, /invoices\.length>0\?/);
  assert.match(app, /No invoices yet/);
  assert.match(app, /Belum ada invois/);
  assert.match(app, /لا توجد فواتير بعد/);
  assert.doesNotMatch(app, /invoices\.at\(-1\)\?\.customer/);
});

test('green business workspace retains RTL and responsive layout rules', () => {
  assert.match(css, /\.satuBusinessWelcome\{/);
  assert.match(css, /#0b5d3b/);
  assert.match(css, /\.app\[dir="rtl"\] \.satuBusinessWelcome/);
  assert.match(css, /max-width:360px/);
  assert.match(css, /min-width:700px/);
});
