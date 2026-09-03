import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteEnvs } from "vite-envs";
import csp from "vite-plugin-csp-guard";
import { generateDdiTypes, SCHEMA_PATH as DDI_SCHEMA_PATH } from "@bauhaus/ddi-codegen";

function ddiTypesPlugin(): Plugin {
  return {
    name: "ddi-types-generator",
    async buildStart() {
      await generateDdiTypes();
    },
    configureServer(server) {
      server.watcher.add(DDI_SCHEMA_PATH);
      server.watcher.on("change", async (file) => {
        if (file === DDI_SCHEMA_PATH) {
          await generateDdiTypes();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    // Remplace l'ancien <script>const global = globalThis</script> de index.html.
    // Nécessaire pour les libs (draft-js, etc.) qui référencent `global` (API Node).
    // Le faire au build évite un <script> inline qui forcerait un hash CSP et
    // désactiverait 'unsafe-inline' (indispensable au script d'env runtime de vite-envs).
    define: {
      global: "globalThis",
    },

    resolve: {
      tsconfigPaths: true,
    },

    // highlight.js n'est chargé qu'en import dynamique (aperçu DDI). Sans pré-bundling,
    // Vite ne le découvre qu'au premier rendu de l'aperçu, ré-optimise ses dépendances et
    // invalide le `browserHash` : l'import en vol échoue alors avec
    // « Failed to fetch dynamically imported module: .../deps/highlight__js_lib_core.js ».
    optimizeDeps: {
      include: [
        "highlight.js/lib/core",
        "highlight.js/lib/languages/xml",
        "highlight.js/lib/languages/json",
      ],
    },

    build: {
      outDir: "build",
    },
    server: {
      port: 3000,
    },
    plugins: [
      ddiTypesPlugin(),
      react(),
      csp({
        algorithm: "sha256",
        // Politique appliquée uniquement au build de prod, pas au serveur de dev.
        dev: { run: false },
        // On fournit la totalité de la politique, sans merge avec celle par défaut du plugin.
        override: true,
        build: {
          // SRI désactivé volontairement : quand il est actif, le plugin recopie les
          // hashes d'intégrité des chunks dans `script-src-elem`. La présence d'un hash
          // dans cette directive fait IGNORER `'unsafe-inline'` par le navigateur pour les
          // éléments <script>, ce qui bloquerait le <script> d'environnement injecté au
          // runtime par vite-envs (contenu dynamique, non hashable au build).
          sri: false,
        },
        policy: {
          "default-src": ["'self'"],
          // 'unsafe-inline' est requis : vite-envs injecte AU RUNTIME (vite-envs.sh) un
          // <script> dont le contenu (env encodé en base64) varie par déploiement, donc
          // non hashable au build. ajax.googleapis.com sert jQuery (cf. index.html).
          "script-src": ["'self'", "'unsafe-inline'", "https://ajax.googleapis.com"],
          // 'unsafe-inline' requis pour les styles inline injectés par React / PrimeReact
          // et la feuille Google Fonts chargée via <link> dans index.html.
          "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
          "img-src": ["'self'", "data:", "blob:"],
          // API et OIDC sont configurés par déploiement (inconnus au build). Les placeholders
          // %VAR% sont substitués au démarrage du conteneur par vite-envs.sh dans index.html.
          // Le '/' final est nécessaire au matching de chemin CSP (ex. /api couvre /api/...).
          // Important : ne pas mettre de slash final à VITE_API_BASE_HOST / VITE_OIDC_ISSUER.
          "connect-src": ["'self'", "%VITE_API_BASE_HOST%/", "%VITE_OIDC_ISSUER%/"],
          // oidc-spa renouvelle les tokens via une iframe pointant vers l'issuer.
          "frame-src": ["'self'", "%VITE_OIDC_ISSUER%/"],
          "worker-src": ["'self'", "blob:"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "form-action": ["'self'"],
        },
      }),
      viteEnvs({
        declarationFile: ".env",
        computedEnv: async () => {
          const path = await import("path");
          const fs = await import("fs/promises");

          const packageJson = JSON.parse(
            await fs.readFile(path.resolve(__dirname, "package.json"), "utf-8"),
          );

          // Here you can define any arbitrary values they will be available
          // in `import.meta.env` and it's type definitions.
          // You can also compute defaults for variable declared in `.env` files.
          return {
            VITE_NAME: packageJson.name,
            VITE_VERSION: packageJson.version,
          };
        },
      }),
    ],
  };
});
