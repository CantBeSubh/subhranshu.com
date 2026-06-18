import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  ignores: [
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "eslint.config.mjs",
    "next.config.js",
    "postcss.config.js",
    ".prettierrc.js",
    "next-env.d.ts",
  ],
}, {
  extends: [
    ...compat.extends("eslint:recommended"),
    ...compat.extends("plugin:react/recommended"),
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    ...compat.extends("plugin:prettier/recommended"),
    ...compat.extends("plugin:jsx-a11y/strict"),
    ...compat.extends("plugin:tailwindcss/recommended"),
    ...compat.extends("next/core-web-vitals"),
  ],

  plugins: {
    react,
    "@typescript-eslint": typescriptEslint,
    prettier,
    "jsx-a11y": jsxA11Y,
    tailwindcss,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: true,
    },
  },

  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
    },
  },

  rules: {
    "prettier/prettier": "warn",
    "react-hooks/exhaustive-deps": "error",
    "no-var": "error",
    "brace-style": "error",
    "prefer-template": "error",
    radix: "error",
    "space-before-blocks": "error",
    "import/prefer-default-export": "off",
    "tailwindcss/no-custom-classname": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "semi": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],

    "no-console": ["error", {
      allow: ["warn", "error"],
    }],

    curly: "error",
  },
}, {
  files: [
    "**/*.test.js",
    "**/*.test.jsx",
    "**/*.test.tsx",
    "**/*.spec.js",
    "**/*.spec.jsx",
    "**/*.spec.tsx",
  ],

  languageOptions: {
    globals: {
      ...globals.jest,
    },
  },
}]);
