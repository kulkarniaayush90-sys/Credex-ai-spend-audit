import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";

const nextVitalsConfig = Array.isArray(nextVitals) ? nextVitals : [nextVitals];

export default defineConfig([
  ...nextVitalsConfig,
  globalIgnores([
    ".next/**",
    "coverage/**",
    "dist/**",
    "node_modules/**",
    "playwright-report/**"
  ])
]);
