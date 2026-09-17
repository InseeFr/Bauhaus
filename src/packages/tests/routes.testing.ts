import type { RouteObject } from "react-router-dom";
import { expect, it } from "vitest";

/**
 * Chaque `lazy` doit résoudre un module exportant `Component` : une route qui pointe vers
 * un fichier renommé ou sans export `Component` casse au clic, pas au build.
 */
export const itLoadsAComponentForEveryLazyRoute = (routes: RouteObject[]) =>
  it.each(routes.filter((route) => route.lazy).map((route) => [route.path, route.lazy!] as const))(
    "route %s : le module chargé à la demande expose un Component",
    async (_path, lazy) => {
      const module = (await (lazy as any)()) as { Component?: unknown };

      expect(module.Component).toBeInstanceOf(Function);
    },
  );

/** Toutes les routes du module sont chargées à la demande, chacune sous un chemin distinct. */
export const itDeclaresOnlyLazyRoutesWithDistinctPaths = (routes: RouteObject[]) => {
  it("déclare toutes ses routes en chargement à la demande", () => {
    expect(routes.every((route) => typeof route.lazy === "function")).toBe(true);
  });

  it("n'enregistre pas deux fois le même chemin", () => {
    const paths = routes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });
};
