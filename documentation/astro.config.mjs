import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
  base: "Bauhaus",
  trailingSlash: "always",
  integrations: [
    mermaid(),
    starlight({
      title: "Bauhaus",

      defaultLocale: "root",

      locales: {
        // English docs in `src/content/docs/en/`
        root: {
          label: "English",
          lang: "en",
        },
      },
      sidebar: [
        {
          label: "Developer Guide",
          items: [
            // Each item here is one entry in the navigation menu.

            {
              label: "Getting Started",
              link: import.meta.env.BASE_URL + "guides/getting-started/",
            },

            {
              label: "Architecture",
              link: import.meta.env.BASE_URL + "guides/architecture/",
            },

            {
              label: "Conventional Commits",
              link: import.meta.env.BASE_URL + "guides/conventional_commit/",
            },
            {
              label: "Git Branch Management Strategy",
              link: import.meta.env.BASE_URL + "guides/pr_branch_strategy/",
            },
            {
              label: "Roles & Permissions (RBAC)",
              link: import.meta.env.BASE_URL + "guides/rbac/",
            },
          ],
        },
        {
          label: "Module Concepts",
          collapsed: true,
          items: [
            {
              label: "Getting Started",
              link:
                import.meta.env.BASE_URL + "guides/getting-started-concepts/",
            },
            {
              label: "RDF Data Model",
              link:
                import.meta.env.BASE_URL + "guides/concepts-rdf-predicates/",
            },
          ],
        },
        {
          label: "Module Variables",
          collapsed: true,
          items: [
            {
              label: "Integration with Colectica",
              link: import.meta.env.BASE_URL + "guides/colectica/",
            },
          ],
        },
        {
          label: "User Guide",
          autogenerate: {
            directory: import.meta.env.BASE_URL + "guides/user-guide",
          },
        },
      ],
    }),
  ],
});
