import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin /*, loadEnv*/ } from "vite";
import { viteEnvs } from "vite-envs";
import {
  generateDdiTypes,
  SCHEMA_PATH as DDI_SCHEMA_PATH,
} from "./scripts/generate-ddi-types";

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

export default defineConfig((/*{ mode }*/) => {
  //const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      tsconfigPaths: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler" as const,
        },
      },
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
      //			csp({
      //				dev: {
      //					run: true,
      //				},
      //				policy: {
      //					'style-src-elem': ["'unsafe-inline'", 'https://fonts.googleapis.com'],
      //					'script-src-elem': ["'self'", 'https://ajax.googleapis.com/'],
      //					'font-src': ["'self'", 'https://fonts.gstatic.com/'],
      //					'connect-src': [env.VITE_API_BASE_HOST + '/', 'ws://localhost:3000'],
      //				},
      //				build: {
      //					sri: true,
      //				},
      //			}),
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
