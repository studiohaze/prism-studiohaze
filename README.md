# Prism support for Topaz and Lispex

External Prism **1.x** highlighting maintained by STUDIO HAZE, independent of
Prism core. Topaz (`topaz`, `tpz`, `.tpz`) and Lispex (`lispex`, `lspx`, `.lspx`)
are covered. This does not claim Prism 2 compatibility or upstream endorsement.

Prism's current README accepts security-relevant PRs only while v2 is developed.
This package follows its documented extension/hook API instead of submitting a
new-language PR during that restriction. No upstream issue or PR is included.

## Use

Clone this repository and load it with an existing Prism 1.30 installation:

```js
const Prism = require('prismjs');
const support = require('./prism-studiohaze');
support.install(Prism);
const html = Prism.highlight('(define x 1/3)', Prism.languages.lispex, 'lispex');
```

For browsers, load Prism 1.30, then `src/grammars.js`, then `src/plugin.js`.
Normal `Prism.highlight`, `highlightElement` and `highlightAll` calls use the
registered `after-tokenize` hook. Script loading order matters.
The plug-in requires a modern JavaScript engine with Unicode property escapes,
sticky regular expressions and `Array.prototype.flatMap` (ES2019 or later).

The lower-level `Prism.tokenize` API does not run hooks. Use
`support.tokenize(Prism, source, 'lispex')` when tokens rather than HTML are
needed. The registered empty grammar objects intentionally delegate tokenization
to this plug-in; they are not standalone regular-expression components.

The stateful tokenizer supports arbitrarily nested Lispex block comments and
Topaz interpolation without a fixed regex nesting limit. Comments, strings,
characters, exact rationals, numeric forms, documented keywords and Unicode names
are highlighted. Highlighting does not validate a program or execute it.

## Test and references

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The full fixtures were executed with official Topaz 5.21.0 (`--compiler rust`)
and Lispex 1.21.1 CLIs. Tests cover source preservation, token boundaries,
100-level nested comments, complete programs, HTML escaping and browser loading.

- [Topaz](https://topaz.ooo/) · [public release sources](https://github.com/studiohaze/topaz)
- [Lispex](https://www.lispex.com/)
- [Prism contribution status](https://github.com/PrismJS/prism#contribute-to-prism)
- [Prism extension API](https://prismjs.com/extending.html)

Only new highlighting code and public examples are included. MIT licensed.
The npm package is prepared for publication.
