/**
 * Paramètres de route pilotables par le test : importer ce module remplace `useParams` de
 * `react-router-dom` par `params`, à configurer avec `params.mockReturnValue({ … })`.
 *
 * Le mock est enregistré à l'import de ce module : il doit donc être importé avant la page testée
 * (ce que garantit l'ordre des imports, les chemins parents précédant `./page`).
 */
export const params = vi.fn();

vi.mock("react-router-dom", async () =>
  (await import("./router.testing")).withMockedParams(() => params()),
);
