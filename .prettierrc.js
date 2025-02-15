module.exports = {
  endOfLine: "lf",
  printWidth: 80,
  tabWidth: 2,
  singleQuote: false,
  semi: false,
  trailingComma: "none",
  arrowParens: "avoid",
  bracketSpacing: true,
  htmlWhitespaceSensitivity: "css",
  bracketSameLine: false,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  embeddedLanguageFormatting: "auto",
  vueIndentScriptAndStyle: false,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
};
