import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint, { parser } from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettier from "prettier";
import jestPlugin from "eslint-plugin-jest"; // Adicione o plugin do Jest

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Inclui suporte ao Node.js
        ...globals.jest, // Inclui suporte ao Jest
      },
      parser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      tseslint: tseslint.plugin,
      prettier: prettier,
      jest: jestPlugin, // Adiciona o plugin do Jest
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "jest/no-disabled-tests": "warn", // Regras específicas do Jest
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["node_modules", "dist", "build", "/*.js"],
  },
];
