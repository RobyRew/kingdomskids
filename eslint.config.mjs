import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import sonarjs from "eslint-plugin-sonarjs";
import prettier from "eslint-config-prettier";

const cleanCode = {
  // "Functions should hardly ever be 20 lines long."
  "max-lines-per-function": [
    "error",
    { max: 20, skipBlankLines: true, skipComments: true },
  ],
  "max-statements": ["error", 10],
  complexity: ["error", 8],

  // "The indent level of a function should not be greater than one or two."
  "max-depth": ["error", 2],
  "max-nested-callbacks": ["error", 2],

  // Triadic should be avoided; polyadic "shouldn't be used anyway".
  "max-params": ["error", 3],

  // Files around 200 lines. One responsibility per file.
  "max-lines": [
    "error",
    { max: 200, skipBlankLines: true, skipComments: true },
  ],
  "max-classes-per-file": ["error", 1],

  // Guard clauses instead of nesting.
  "no-else-return": ["error", { allowElseIf: false }],
  "no-lonely-if": "error",
  "no-negated-condition": "error",
  "no-nested-ternary": "error",
  "no-unneeded-ternary": "error",

  // Names must be searchable and intention-revealing.
  "id-length": ["error", { min: 3, properties: "never", exceptions: ["_"] }],
  camelcase: ["error", { properties: "always" }],

  // No side effects. Command-query separation.
  "no-param-reassign": ["error", { props: true }],
  "consistent-return": "error",
  "no-shadow": "error",
  "prefer-const": "error",
  eqeqeq: ["error", "always"],

  // "Passing a boolean into a function is a truly terrible practice."
  "sonarjs/no-selector-parameter": "error",

  // Don't repeat yourself.
  "sonarjs/no-identical-functions": "error",
  "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],

  // "Comments are always failures." Commented-out code is worse.
  "sonarjs/no-commented-code": "error",

  "sonarjs/cognitive-complexity": ["error", 8],

  // Trail of Bits: absolute imports only, no relative traversal.
  "no-restricted-imports": ["error", { patterns: ["../*"] }],
};

export default [
  { ignores: ["dist/", ".astro/", "node_modules/", ".claude/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  sonarjs.configs.recommended,
  // Crashes on Windows: the rule compares drive-letter casing as strings and
  // the file path and its computed topDir disagree. Test-only rule, no tests.
  { rules: { "sonarjs/no-skipped-tests": "off" } },
  { files: ["src/**/*.{ts,astro}"], rules: cleanCode },
  prettier,
];
