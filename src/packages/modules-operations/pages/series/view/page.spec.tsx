import { screen, waitFor } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { itPublishesThenReloads, itShowsPublicationError, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getSerie: vi.fn(), publishSeries: vi.fn() },
}));

vi.mock("@utils/hooks/codelist", () => ({
  useCodelist: (id: string) => ({
    codes:
      id === "CL_FREQ"
        ? [{ code: "A", labelLg1: "Annuelle" }]
        : [{ code: "SRC", labelLg1: "Enquête" }],
  }),
}));
vi.mock("@utils/hooks/organizations", () => ({ useOrganizations: () => ({ data: [] }) }));
vi.mock("@utils/hooks/useLocales", () => ({ useLocales: () => ["fr", "en"] }));

vi.mock("./components/OperationsSerieVisualization", () => ({
  OperationsSerieVisualization: ({ frequency, category }: any) => (
    <div>
      <span>fréquence:{frequency?.labelLg1 ?? "(aucune)"}</span>
      <span>catégorie:{category?.labelLg1 ?? "(aucune)"}</span>
    </div>
  ),
}));
vi.mock("./menu", async () => (await import("../../page.testing")).publishMenuModule("onPublish"));

const serie = {
  id: "s-1",
  prefLabelLg1: "Série FR",
  prefLabelLg2: "Series EN",
  accrualPeriodicityCode: "A",
  typeCode: "SRC",
};

const renderPage = () => renderAtRoute(<Component />, "/series/:id", "/series/s-1");

const publication = {
  renderPage,
  publish: OperationsApi.publishSeries,
  load: OperationsApi.getSerie,
  entity: serie,
};

describe("Series view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi.getSerie).mockResolvedValue(serie);
    vi.mocked(OperationsApi.publishSeries).mockResolvedValue({});
  });

  it("charge la série puis résout sa fréquence et sa catégorie dans les listes de codes", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("fréquence:Annuelle")).toBeInTheDocument());
    expect(screen.getByText("catégorie:Enquête")).toBeInTheDocument();
    expect(OperationsApi.getSerie).toHaveBeenCalledWith("s-1");
  });

  it("laisse fréquence et catégorie vides quand les codes ne correspondent à rien", async () => {
    vi.mocked(OperationsApi.getSerie).mockResolvedValue({
      ...serie,
      accrualPeriodicityCode: "Z",
      typeCode: "Z",
    });
    renderPage();

    await waitFor(() => expect(screen.getByText("fréquence:(aucune)")).toBeInTheDocument());
    expect(screen.getByText("catégorie:(aucune)")).toBeInTheDocument();
  });

  itPublishesThenReloads("publie la série puis la recharge", publication);

  itShowsPublicationError(
    "affiche l'erreur serveur quand la publication échoue, et sort de l'état publication",
    publication,
    () => expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
  );
});
