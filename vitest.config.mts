import path from "node:path";
import { defineConfig } from "vitest/config";

/*
 * Vitest ne lit pas le tsconfig : l'alias `@/` doit être redéclaré ici,
 * sinon les imports `@/types/cart` des fichiers de test ne résolvent pas.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
