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
          label: "User Guide",
          autogenerate: {
            directory: import.meta.env.BASE_URL + "guides/user-guide",
          },
        },
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
              label: "Gitleaks",
              link: import.meta.env.BASE_URL + "guides/gitleaks/",
            },
            {
              label: "Roles & Permissions (RBAC)",
              link: import.meta.env.BASE_URL + "guides/rbac/",
            },
          ],
        },
        {
          label: "How-to Guides",
          items: [
            {
              label: "Run Tests",
              link: import.meta.env.BASE_URL + "guides/how-to/run-tests/",
            },
            {
              label: "Build",
              link: import.meta.env.BASE_URL + "guides/how-to/build/",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            {
              label: "Project Structure",
              link:
                import.meta.env.BASE_URL +
                "guides/reference/project-structure/",
            },
          ],
        },
        {
          label: "Module Concepts",
          collapsed: true,
          items: [
            {
              label: "Tutorial: Getting Started",
              link:
                import.meta.env.BASE_URL + "guides/getting-started-concepts/",
            },
            {
              label: "Explanation",
              items: [
                {
                  label: "Overview",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/concepts/explanation/overview/",
                },
              ],
            },
            {
              label: "How-to Guides",
              items: [
                {
                  label: "Configure Module Visibility",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/concepts/how-to/configure-module/",
                },
                {
                  label: "Import Sample Data",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/concepts/how-to/import-sample-data/",
                },
              ],
            },
            {
              label: "Reference",
              items: [
                {
                  label: "RDF Data Model",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/concepts-rdf-predicates/",
                },
                {
                  label: "Configuration Properties",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/concepts/reference/configuration-properties/",
                },
              ],
            },
          ],
        },
        {
          label: "Module Variables",
          collapsed: true,
          items: [
            {
              label: "Explanation",
              items: [
                {
                  label: "Overview",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/variables/explanation/overview/",
                },
              ],
            },
            {
              label: "How-to Guides",
              items: [
                {
                  label: "Configure Mock Server",
                  link:
                    import.meta.env.BASE_URL +
                    "guides/variables/how-to/configure-mock-server/",
                },
              ],
            },
            {
              label: "Reference",
              items: [
                {
                  label: "Colectica API",
                  link: import.meta.env.BASE_URL + "guides/colectica/",
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
