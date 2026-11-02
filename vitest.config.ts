import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: [
      // Les sous-paquets de @mantle-ui/react n'ont pas d'`exports`, seulement `main` (CJS) et
      // `module` (ESM). Le build CJS lit `MantleUI.zIndex` sur le namespace du module `api`
      // au lieu de son export par défaut (TypeError « reading 'toast' ») : on pointe chaque
      // sous-paquet sur son build ESM, celui du build de production.
      {
        find: /^@mantle-ui\/react\/([a-z]+)$/,
        replacement: "@mantle-ui/react/$1/$1.esm.js",
      },
    ],
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
    server: {
      deps: {
        // Son build ESM se déclare `"type": "module"` mais importe `./Editor.nohighlight`
        // sans extension : Node refuse de le charger (« Cannot find module »). L'inliner
        // le fait résoudre par Vite, comme au build. @mantle-ui/react aussi : sans cela,
        // Node charge ses sous-paquets via `main` (CJS) en ignorant `mainFields`.
        inline: ["@uiw/react-md-editor", "@mantle-ui/react"],
      },
    },
    // Les specs qui mockent react-query (mockReactQueryForRbac) doivent importer le
    // composant dynamiquement DANS le test : le coût de l'import à froid du graphe de
    // modules est donc compté dans le budget du test. Il passe de ~230 ms à vide à plus
    // d'une seconde quand les 413 fichiers tournent en parallèle sur une machine chargée,
    // et franchit les 5 s par défaut de Vitest (faux échec au pre-push).
    testTimeout: 20000,
  },
});
