import { routes } from "./index";

describe("Concepts routes", () => {
  // Chaque `lazy` doit résoudre un module exportant `Component` : une route qui pointe vers
  // un fichier renommé ou sans export `Component` casse au clic, pas au build.
  it.each(routes.map((route) => [route.path, route.lazy!] as const))(
    "route %s : le module chargé à la demande expose un Component",
    async (_path, lazy) => {
      const module = (await (lazy as any)()) as { Component?: unknown };

      expect(module.Component).toBeInstanceOf(Function);
    },
  );

  it("déclare toutes ses routes en chargement à la demande", () => {
    expect(routes.every((route) => typeof route.lazy === "function")).toBe(true);
  });

  it("n'enregistre pas deux fois le même chemin", () => {
    const paths = routes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });
});
