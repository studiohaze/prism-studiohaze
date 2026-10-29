'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const Prism = require('prismjs');
const support = require('..');
support.install(Prism);

function checked(source, language) {
  const tokens = support.tokenize(Prism, source, language);
  assert.equal(tokens.map(t => typeof t === 'string' ? t : t.content).join(''), source);
  assert.ok(!tokens.some(t => t.type === 'error'));
  return tokens;
}

function token(tokens, content, type) {
  assert.ok(tokens.some(t => t.content === content && t.type === type),
    'Missing ' + type + ' ' + JSON.stringify(content));
}

test('Topaz names, numbers, non-nesting comments and interpolation', () => {
  const tokens = checked('let let💎: int = 0x2A\nlet n = 0b10_10\nlet text = "Hi {let💎}"\n/* outer /* inner */ let done = true\n', 'topaz');
  token(tokens, 'let', 'keyword');
  token(tokens, 'let💎', 'variable');
  token(tokens, '0x2A', 'number');
  token(tokens, '0b10_10', 'number');
  token(tokens, 'done', 'variable');
  token(tokens, 'true', 'boolean');
});

test('Topaz triple string preserves comment-like text', () => {
  const tokens = checked('let s = """\n// string body\n"""\n', 'tpz');
  assert.ok(!tokens.some(t => t.type === 'comment'));
});

test('Lispex exact numbers, characters and whole atoms', () => {
  const tokens = checked('(define +5 1/3)\n(list #\\" #\\; #f "text;")\n', 'lispex');
  token(tokens, '+5', 'variable');
  token(tokens, '1/3', 'number');
  token(tokens, '#f', 'boolean');
  token(tokens, '#\\"', 'char');
  token(tokens, '#\\;', 'char');
});

test('Lispex 100-level nested block comments', () => {
  const source = '#| '.repeat(100) + 'inner' + ' |#'.repeat(100) + ' (define done #t)';
  const tokens = checked(source, 'lspx');
  token(tokens, 'define', 'keyword');
  assert.equal(tokens[0].type, 'comment');
  assert.equal(tokens[0].content, source.slice(0, source.indexOf(' (define')));
});

for (const [language, extension] of [['topaz', 'tpz'], ['lispex', 'lspx']]) {
  test(language + ' complete executed program and standard highlight hook', () => {
    const source = fs.readFileSync(path.join(__dirname, 'fixtures', language + '.' + extension), 'utf8');
    checked(source, language);
    const html = Prism.highlight(source, Prism.languages[language], language);
    assert.match(html, /class="token keyword"/);
    assert.doesNotMatch(html, /class="token error"/);
    const decoded = html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    assert.equal(decoded, source);
  });
}

test('HTML input stays escaped and double installation is harmless', () => {
  support.install(Prism);
  const html = Prism.highlight('"<script>&"', Prism.languages.topaz, 'topaz');
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script/);
  assert.match(html, /&amp;/);
});

test('browser script loading registers both language aliases', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('prismjs'), 'utf8'), context);
  for (const file of ['grammars.js', 'plugin.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', file), 'utf8'), context);
  }
  assert.match(vm.runInContext('Prism.highlight("(define x 1/3)", Prism.languages.lspx, "lspx")', context), /token number/);
  assert.match(vm.runInContext('Prism.highlight("let x = 3", Prism.languages.tpz, "tpz")', context), /token keyword/);
});
