import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
test('integration contains the multi-business homepage and Meetings route',()=>{assert.match(app,/satuBusinessWelcome/);assert.match(app,/satuMeetingsEntry/);assert.match(app,/page==='meetings'/);assert.match(app,/import Meetings from/);});
test('integrated welcome has RTL and mobile styling',()=>{assert.match(css,/\.satuBusinessWelcome\{/);assert.match(css,/@media\(max-width:600px\)/);assert.match(css,/\.app\[dir="rtl"\]/);});
test('Arabic Kufi remains locally bundled',()=>{assert.match(app,/@fontsource\/noto-kufi-arabic\/400.css/);assert.match(css,/Noto Kufi Arabic/);});
