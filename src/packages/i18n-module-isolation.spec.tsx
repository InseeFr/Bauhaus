import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

/* Chaque module embarque son propre catalogue de traductions. Tant qu'ils partagent
   la même instance i18next, le dernier module chargé écrase les ressources des
   précédents : ceux-ci retombent alors sur leurs clés brutes jusqu'au prochain
   rechargement complet de la page. */

const MODULE_KEYS = {
  concepts: ["common.help", "Help"],
  classifications: ["classification.pluralTitle", "Classifications"],
  operations: ["creators.title", "Owners"],
  structures: ["structure.title", "Structure"],
  datasets: ["dataset.title", "Dataset"],
  codelists: ["codelists.title", "Codelist"],
  ddi: ["ddi.title", "Variables"],
} as const;

describe("isolation des catalogues i18n entre modules", () => {
  it("garde le menu du module traduit après un aller-retour vers un autre module", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "ddi",
          lazy: () => import("./modules-ddi/routes/layout"),
          children: [{ path: "", element: <div>page ddi</div> }],
        },
        {
          path: "codelists",
          lazy: () => import("./modules-codelists/routes/layout"),
          children: [{ path: "", element: <div>page codelists</div> }],
        },
      ],
      { initialEntries: ["/ddi"] },
    );

    render(
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>,
    );
    await screen.findByText("page ddi");
    const menuAvant = screen.getByRole("navigation").textContent;

    await router.navigate("/codelists");
    await screen.findByText("page codelists");

    await router.navigate("/ddi");
    await screen.findByText("page ddi");

    expect(screen.getByRole("navigation").textContent).toBe(menuAvant);
  });

  it("traduit chaque module même quand tous les autres ont été chargés", async () => {
    const modules = await Promise.all(
      Object.keys(MODULE_KEYS).map(async (name) => ({
        name,
        i18n: (await import(`./modules-${name}/i18n/index.ts`)).default,
      })),
    );

    const translations = modules.map(({ name, i18n }) => {
      const [key] = MODULE_KEYS[name as keyof typeof MODULE_KEYS];
      return [name, i18n.t(key)];
    });

    expect(Object.fromEntries(translations)).toEqual(
      Object.fromEntries(Object.entries(MODULE_KEYS).map(([name, [, label]]) => [name, label])),
    );
  });
});
