(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.StudioHazePrismGrammars = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return {
  "topaz": {
    "root": [
      {
        "pattern": "\\s+",
        "type": null
      },
      {
        "pattern": "//[^\\n]*",
        "type": "comment"
      },
      {
        "pattern": "/\\*",
        "type": "comment",
        "push": "comment"
      },
      {
        "pattern": "(?:\\b(?:p|r|sh|sql))?\"\"\"",
        "type": "string",
        "push": "triple-string"
      },
      {
        "pattern": "(?:\\b(?:p|r|sh|sql))?\"",
        "type": "string",
        "push": "string"
      },
      {
        "pattern": "0[xX][\\da-fA-F](?:_?[\\da-fA-F])*",
        "type": "number"
      },
      {
        "pattern": "0[bB][01](?:_?[01])*",
        "type": "number"
      },
      {
        "pattern": "\\d(?:_?\\d)*\\.\\d(?:_?\\d)*",
        "type": "number"
      },
      {
        "pattern": "\\d(?:_?\\d)*",
        "type": "number"
      },
      {
        "pattern": "(import|export|as)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "keyword"
      },
      {
        "pattern": "(let|mut|const|type|function|record|enum|newtype|protocol|impl|derives)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "keyword"
      },
      {
        "pattern": "(return|if|else|match|case|for|in|by|while|loop|break|continue|defer|using|concurrent)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "keyword"
      },
      {
        "pattern": "(true|false|null|None)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "boolean"
      },
      {
        "pattern": "(int|float|bool|string|template|Array|Map|Set|Option|Result|Eq|Order|Show|JSON)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "class-name"
      },
      {
        "pattern": "(Some|Ok|Err)(?![\\p{L}\\p{N}_\\p{So}])",
        "type": "builtin"
      },
      {
        "pattern": "[\\p{L}_\\p{So}][\\p{L}\\p{N}_\\p{So}]*",
        "type": "variable"
      },
      {
        "pattern": "->|=>|\\.\\.<|\\.\\.\\.|\\.\\.|[+*/%=!<>|&?^-]+",
        "type": "operator"
      },
      {
        "pattern": "[{}()\\[\\],.:]",
        "type": "punctuation"
      }
    ],
    "comment": [
      {
        "pattern": "\\*/",
        "type": "comment",
        "pop": true
      },
      {
        "pattern": "[^*]+",
        "type": "comment"
      },
      {
        "pattern": "\\*",
        "type": "comment"
      }
    ],
    "string": [
      {
        "pattern": "\"",
        "type": "string",
        "pop": true
      },
      {
        "pattern": "\\\\[\\s\\S]",
        "type": "escape"
      },
      {
        "pattern": "\\{",
        "type": "interpolation-punctuation",
        "push": "interpolation"
      },
      {
        "pattern": "[^\"\\\\{]+",
        "type": "string"
      }
    ],
    "triple-string": [
      {
        "pattern": "\"\"\"",
        "type": "string",
        "pop": true
      },
      {
        "pattern": "\\\\[\\s\\S]",
        "type": "escape"
      },
      {
        "pattern": "\\{",
        "type": "interpolation-punctuation",
        "push": "interpolation"
      },
      {
        "pattern": "[^\"\\\\{]+|\"",
        "type": "string"
      }
    ],
    "interpolation": [
      {
        "pattern": "\\}",
        "type": "interpolation-punctuation",
        "pop": true
      },
      {
        "pattern": "\\{",
        "type": "punctuation",
        "push": "interpolation"
      },
      {
        "include": "root"
      }
    ]
  },
  "lispex": {
    "root": [
      {
        "pattern": "\\s+",
        "type": null
      },
      {
        "pattern": ";[^\\n]*",
        "type": "comment"
      },
      {
        "pattern": "#\\|",
        "type": "comment",
        "push": "comment"
      },
      {
        "pattern": "#\\\\(?:x[\\da-fA-F]+|[A-Za-z]+|[^\\s])",
        "type": "char"
      },
      {
        "pattern": "\"",
        "type": "string",
        "push": "string"
      },
      {
        "pattern": "#(?:true|false|t|f)(?=$|[\\s()'`,;\"])",
        "type": "boolean"
      },
      {
        "pattern": "-?(?:0|[1-9]\\d*)/[1-9]\\d*(?=$|[\\s()'`,;\"])",
        "type": "number"
      },
      {
        "pattern": "-?(?:0|[1-9]\\d*)(?:\\.\\d+(?:[eE][-+]?\\d+)?|[eE][-+]?\\d+)(?=$|[\\s()'`,;\"])",
        "type": "number"
      },
      {
        "pattern": "-?(?:0|[1-9]\\d*)(?=$|[\\s()'`,;\"])",
        "type": "number"
      },
      {
        "pattern": "(quote|quasiquote|unquote|unquote-splicing|lambda|if|begin|set!|define|let|let\\*|letrec|cond|case|guard|and|or|when|unless|do|module|export|import)(?=$|[\\s()'`,;\"])",
        "type": "keyword"
      },
      {
        "pattern": "(values|call-with-values|call/cc|dynamic-wind|cons|car|cdr|list|map|apply|error|error-object\\?|error-object-message|number\\?|string\\?|boolean\\?|pair\\?|null\\?|vector|vector-ref|bytevector-u8-ref|display|newline|\\+|-|\\*|/|=|<|>|<=|>=)(?=$|[\\s()'`,;\"])",
        "type": "builtin"
      },
      {
        "pattern": "'[\\p{L}_][^\\s()'`,;\"#]*",
        "type": "symbol"
      },
      {
        "pattern": "#(?:u8)?\\(",
        "type": "punctuation"
      },
      {
        "pattern": ",@|['`,]",
        "type": "operator"
      },
      {
        "pattern": "[^\\s()'`,;\"#]+",
        "type": "variable"
      },
      {
        "pattern": "[()]",
        "type": "punctuation"
      }
    ],
    "comment": [
      {
        "pattern": "#\\|",
        "type": "comment",
        "push": "comment"
      },
      {
        "pattern": "\\|#",
        "type": "comment",
        "pop": true
      },
      {
        "pattern": "[^#|]+|[#|]",
        "type": "comment"
      }
    ],
    "string": [
      {
        "pattern": "\"",
        "type": "string",
        "pop": true
      },
      {
        "pattern": "\\\\(?:[\"\\\\ntr]|x[\\da-fA-F]+;)",
        "type": "escape"
      },
      {
        "pattern": "[^\"\\\\]+",
        "type": "string"
      }
    ]
  }
};
}));
