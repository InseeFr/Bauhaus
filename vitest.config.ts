import react from "@vitejs/plugin-react";
import { defaultClientConditions } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Sans `module-sync`, `react-router` se résout vers son build CJS alors que
    // `react-router/dom` (RouterProvider de l'application) charge le build ESM : deux
    // contextes de routeur, et `useRouteError` lève « must be used within a data router ».
    conditions: [...defaultClientConditions, "module-sync"],
  },
  plugins: [react()],
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
    },
    include: ["src/**/*.spec.*"],
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./setupTests.js"],
    // Les specs qui mockent react-query (mockReactQueryForRbac) doivent importer le
    // composant dynamiquement DANS le test : le coût de l'import à froid du graphe de
    // modules est donc compté dans le budget du test. Il passe de ~230 ms à vide à plus
    // d'une seconde quand les 413 fichiers tournent en parallèle sur une machine chargée,
    // et franchit les 5 s par défaut de Vitest (faux échec au pre-push).
    testTimeout: 20000,
  },
});
