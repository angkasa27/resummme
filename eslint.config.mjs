import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Design-system guards. Both of these codify a regression that already
    // happened once: form spacing drifted to ten different gap values because
    // every call site overrode the primitive, and the type scale grew a tail of
    // one-off pixel sizes.
    // The editor's surfaces + the primitives they share. The landing page is
    // marketing with its own display treatments and is deliberately exempt.
    files: [
      "src/features/**/*.{ts,tsx}",
      "src/components/ui/**/*.{ts,tsx}",
      "src/app/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.name=/^(Field|FieldGroup|FieldSet|FieldContent)$/] > JSXAttribute[name.name='className'] Literal[value=/\\bgap(-[xy])?-\\d/]",
          message:
            "Form spacing lives in src/components/ui/field.tsx (4/8/16/24). Don't override gap at the call site — fix the primitive or use `layout`.",
        },
        {
          selector: "Literal[value=/\\btext-\\[\\d+px\\]/]",
          message:
            "Use the type scale: text-2xl (display) | text-base (dialog title) | text-sm (default) | text-xs (meta).",
        },
      ],
    },
  },
]);

export default eslintConfig;
