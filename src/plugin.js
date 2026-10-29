(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./grammars'));
  } else {
    root.StudioHazePrism = factory(root.StudioHazePrismGrammars);
    if (root.Prism) root.StudioHazePrism.install(root.Prism);
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (definitions) {
  'use strict';

  const aliases = { topaz: 'topaz', tpz: 'topaz', lispex: 'lispex', lspx: 'lispex' };
  const compiled = {};
  const installed = new WeakSet();

  function rulesFor(language, state) {
    return definitions[language][state].flatMap(function (rule) {
      if (rule.include) return rulesFor(language, rule.include);
      return [{ ...rule, regex: new RegExp(rule.pattern, 'uy') }];
    });
  }

  for (const language of Object.keys(definitions)) {
    compiled[language] = {};
    for (const state of Object.keys(definitions[language])) {
      compiled[language][state] = rulesFor(language, state);
    }
  }

  function tokenize(Prism, source, requestedLanguage) {
    const language = aliases[requestedLanguage];
    if (!language) throw new Error('Unknown STUDIO HAZE language: ' + requestedLanguage);
    const stack = ['root'];
    const result = [];
    let offset = 0;

    function append(type, text) {
      const previous = result[result.length - 1];
      if (!type) {
        if (typeof previous === 'string') result[result.length - 1] += text;
        else result.push(text);
      } else if (previous instanceof Prism.Token && previous.type === type) {
        previous.content += text;
        previous.length += text.length;
      } else {
        const alias = type === 'escape' ? 'string' :
          type === 'interpolation-punctuation' ? 'punctuation' : undefined;
        result.push(new Prism.Token(type, text, alias, text));
      }
    }

    while (offset < source.length) {
      let found = false;
      for (const rule of compiled[language][stack[stack.length - 1]]) {
        rule.regex.lastIndex = offset;
        const match = rule.regex.exec(source);
        if (!match || !match[0].length) continue;
        append(rule.type, match[0]);
        offset += match[0].length;
        if (rule.pop && stack.length > 1) stack.pop();
        if (rule.push) stack.push(rule.push);
        found = true;
        break;
      }
      if (!found) {
        const text = String.fromCodePoint(source.codePointAt(offset));
        append('error', text);
        offset += text.length;
      }
    }
    return result;
  }

  function install(Prism) {
    if (installed.has(Prism)) return;
    installed.add(Prism);
    for (const name of Object.keys(aliases)) Prism.languages[name] = {};
    Prism.hooks.add('after-tokenize', function (environment) {
      if (aliases[environment.language]) {
        environment.tokens = tokenize(Prism, environment.code, environment.language);
      }
    });
  }

  return { install: install, tokenize: tokenize };
}));
