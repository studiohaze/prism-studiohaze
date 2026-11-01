# Topaz and Lispex for Prism

Syntax highlighting for [Topaz](https://topaz.ooo/) and [Lispex](https://www.lispex.com/) in Prism 1.x, from STUDIO HAZE.

## Install

```sh
npm install prismjs prism-studiohaze
```

## Use

```js
const Prism = require('prismjs');
const studiohaze = require('prism-studiohaze');

studiohaze.install(Prism);
const html = Prism.highlight('(define x 1/3)', Prism.languages.lispex, 'lispex');
```

The languages are `topaz` with the alias `tpz` and `lispex` with the alias `lspx`.

In a browser, load Prism 1.30 or a later 1.x release, then `src/grammars.js`, then `src/plugin.js`. After that, `highlightElement` and `highlightAll` work as usual.

The plugin tokenizes through Prism's `after-tokenize` hook, and the low-level `Prism.tokenize` doesn't run hooks. To get tokens instead of HTML, call `studiohaze.tokenize(Prism, source, 'lispex')`.

Nested Lispex block comments and Topaz string interpolation are handled at any depth. The plugin needs an ES2019 engine.

## Develop

```sh
npm ci
npm test
```

## Links

- [Topaz documentation](https://topaz.ooo/en/docs)
- [Topaz source](https://github.com/studiohaze/topaz)
- [Lispex documentation](https://www.lispex.com/en/docs)

## License

MIT
