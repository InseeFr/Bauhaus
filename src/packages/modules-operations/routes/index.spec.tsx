import { describe, expect, it } from "vitest";

import { itLoadsAComponentForEveryLazyRoute } from "../../tests/routes.testing";
import { CREATE, UPDATE, VIEW } from "../pages/sims/constants";
import { routes } from "./index";

const routeAt = (path: string) => {
  const route = routes.find((candidate) => candidate.path === path);
  expect(route, `aucune route déclarée pour "${path}"`).toBeDefined();
  return route!;
};

const loaderOf = (path: string, params: Record<string, string>) =>
  (routeAt(path).loader as any)({ params });

describe("Operations routes", () => {
  it("redirige la racine du module vers les séries", () => {
    expect(routeAt("").element).toBeDefined();
  });

  itLoadsAComponentForEveryLazyRoute(routes);

  it.each([
    ["series/:idParent/sims/create", "series", "/operations/series/s-1/sims/create"],
    ["operation/:idParent/sims/create", "operation", "/operations/operation/s-1/sims/create"],
    ["indicator/:idParent/sims/create", "indicator", "/operations/indicator/s-1/sims/create"],
  ])("la route %s ouvre un rapport en création sur son parent", (path, parentType, baseUrl) => {
    expect(loaderOf(path, { idParent: "s-1" })).toEqual({
      mode: CREATE,
      disableSectionAnchor: true,
      parentType,
      baseUrl,
    });
  });

  it("ouvre un rapport en consultation, ancres de section actives", () => {
    expect(loaderOf("sims/:id", { id: "sims-1" })).toEqual({
      mode: VIEW,
      baseUrl: "/operations/sims/sims-1/section/",
    });
  });

  it("garde la même base d'URL quand une section est ciblée", () => {
    expect(loaderOf("sims/:id/section/:idSection", { id: "sims-1", idSection: "S1" })).toEqual({
      mode: VIEW,
      baseUrl: "/operations/sims/sims-1/section/",
    });
  });

  it("ouvre un rapport en modification, sans ancre de section", () => {
    expect(loaderOf("sims/:id/modify", { id: "sims-1" })).toEqual({
      mode: UPDATE,
      disableSectionAnchor: true,
      baseUrl: "/operations/sims/sims-1/modify",
    });
  });
});
