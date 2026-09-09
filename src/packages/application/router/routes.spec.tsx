import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouteObject, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { Module } from "../app-context";
import { buildModuleRoutes } from "./routes";

/* Le sujet du test est le routage, pas la formulation des pages d'erreur : des marqueurs
   rendent l'assertion insensible à la langue du navigateur de test. */
vi.mock("@components/not-found", () => ({
  NotFound: () => <div>not-found</div>,
  UnderMaintenance: () => <div>under-maintenance</div>,
}));

vi.mock("../../auth/create-oidc", () => ({
  useOidc: vi.fn(),
}));

const renderAt = (path: string, modules: Module[]) => {
  const routes: RouteObject[] = [
    ...buildModuleRoutes(modules),
    { path: "*", element: <div>not-found</div> },
  ];
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
};

describe("buildModuleRoutes", () => {
  it("answers under maintenance on the home page of a module missing from the configuration", () => {
    renderAt("/ddi", [{ identifier: "concepts" }]);

    expect(screen.getByText("under-maintenance")).toBeInTheDocument();
  });

  it("does not expose any page of a module missing from the configuration", () => {
    renderAt("/ddi/physical-instances/fr.insee/abc", [{ identifier: "concepts" }]);

    expect(screen.getByText("not-found")).toBeInTheDocument();
  });

  it("keeps the pages of a module declared in the configuration", () => {
    const ddi = buildModuleRoutes([{ identifier: "ddi" }]).find((route) => route.path === "ddi");

    expect(ddi?.children?.length).toBeGreaterThan(0);
  });
});
