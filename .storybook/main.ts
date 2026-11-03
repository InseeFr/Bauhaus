import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";

// Plugins de vite.config.ts propres à l'application, sans objet dans Storybook. oidc-spa
// injecte son early init dans l'entrée déclarée par index.html et fait échouer le build
// quand cette entrée est le module virtuel de Storybook.
const APPLICATION_ONLY_PLUGINS = new Set(["oidc-spa"]);

const isApplicationOnly = (plugin: PluginOption) =>
  plugin !== null &&
  typeof plugin === "object" &&
  "name" in plugin &&
  APPLICATION_ONLY_PLUGINS.has(plugin.name);

// Un plugin Vite peut renvoyer un tableau de plugins (imbriqués à volonté) : on aplatit avant
// de filtrer pour ne rien laisser passer.
const withoutApplicationOnlyPlugins = (plugins: PluginOption[]): PluginOption[] =>
  plugins.flatMap((plugin) => {
    if (Array.isArray(plugin)) return withoutApplicationOnlyPlugins(plugin);
    return isApplicationOnly(plugin) ? [] : [plugin];
  });

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: withoutApplicationOnlyPlugins(viteConfig.plugins ?? []),
  }),
};
export default config;
