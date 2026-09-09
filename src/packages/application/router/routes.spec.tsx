import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouteObject, RouterProvider } from "react-router-dom";
import { describe, expect, it, Mock, vi } from "vitest";

import type { Module } from "../app-context";
import { useAppContext } from "../app-context";
import { buildModuleRoutes, HomePage } from "./routes";

/* Le sujet du test est le routage, pas la formulation des pages d'erreur : des marqueurs
   rendent l'assertion insensible à la langue du navigateur de test. */
vi.mock("@components/not-found", () => ({
  NotFound: () => <div>not-found</div>,
  UnderMaintenance: () => <div>under-maintenance</div>,
}));

vi.mock("../../auth/create-oidc", () => ({
  useOidc: vi.fn(),
}));

vi.mock("../app-context", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../app-context")>()),
  useAppContext: vi.fn(),
}));

const openModule = (identifier: string): Module => ({
  identifier: identifier as Module["identifier"],
  show: true,
  directAccess: true,
});

const renderAt = (path: string, modules: Module[]) => {
  const routes: RouteObject[] = [
    ...buildModuleRoutes(modules),
    { path: "*", element: <div>not-found</div> },
  ];
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
};

describe("buildModuleRoutes", () => {
  it("answers under maintenance on the home page of a module missing from the configuration", () => {
    renderAt("/ddi", [openModule("concepts")]);

    expect(screen.getByText("under-maintenance")).toBeInTheDocument();
  });

  it("does not expose any page of a module missing from the configuration", () => {
    renderAt("/ddi/physical-instances/fr.insee/abc", [openModule("concepts")]);

    expect(screen.getByText("not-found")).toBeInTheDocument();
  });

  it("answers under maintenance on the home page of a module without direct access", () => {
    renderAt("/ddi", [{ identifier: "ddi", show: false, directAccess: false }]);

    expect(screen.getByText("under-maintenance")).toBeInTheDocument();
  });

  it("does not expose any page of a module without direct access", () => {
    renderAt("/ddi/physical-instances/fr.insee/abc", [
      { identifier: "ddi", show: false, directAccess: false },
    ]);

    expect(screen.getByText("not-found")).toBeInTheDocument();
  });

  it("keeps the pages of a module hidden from the home page but left directly reachable", () => {
    const ddi = buildModuleRoutes([{ identifier: "ddi", show: false, directAccess: true }]).find(
      (route) => route.path === "ddi",
    );

    expect(ddi?.children?.length).toBeGreaterThan(0);
  });

  it("keeps the pages of a module declared in the configuration", () => {
    const ddi = buildModuleRoutes([openModule("ddi")]).find((route) => route.path === "ddi");

    expect(ddi?.children?.length).toBeGreaterThan(0);
  });
});

describe("<HomePage />", () => {
  const renderHomePageWith = (modules: Module[]) => {
    (useAppContext as Mock).mockReturnValue({ properties: { modules } });
    const routes: RouteObject[] = [
      { path: "/", element: <HomePage /> },
      { path: "/concepts", element: <div>concepts landing</div> },
    ];
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/"] })} />);
  };

  it("goes straight to the only module shown on the home page", () => {
    renderHomePageWith([
      openModule("concepts"),
      { identifier: "ddi", show: false, directAccess: true },
    ]);

    expect(screen.getByText("concepts landing")).toBeInTheDocument();
  });
});
