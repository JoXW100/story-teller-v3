// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    [
        {
            rules: {
                "no-unused-vars": "off",
                "@typescript-eslint/no-inferrable-types": "off",
                "@typescript-eslint/no-extraneous-class": "off",
                "@typescript-eslint/no-empty-object-type": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/class-literal-property-style": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": [
                  "warn", // or "error"
                  {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                  }
                ]
            }
        }
    ]
);