import { screen, waitFor } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { itPublishesThenReloads, itShowsPublicationError, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getIndicatorById: vi.fn(), publishIndicator: vi.fn() },
}));

vi.mock("@utils/hooks/codelist", () => ({
  useCodelist: () => ({ codes: [{ code: "A", labelLg1: "Annuelle" }] }),
}));

vi.mock("./components/OperationsIndicatorVisualization", () => ({
  OperationsIndicatorVisualization: ({ attr, frequency }: any) => (
    <div>
      <span>indicateur:{attr.prefLabelLg1}</span>
      <span>fréquence:{frequency?.labelLg1 ?? "(aucune)"}</span>
    </div>
  ),
}));
vi.mock("./menu", async () => (await import("../../page.testing")).publishMenuModule("publish"));

const indicator = {
  id: "ind-1",
  prefLabelLg1: "Indicateur FR",
  prefLabelLg2: "Indicator EN",
  accrualPeriodicityCode: "A",
};

const renderPage = () => renderAtRoute(<Component />, "/indicator/:id", "/indicator/ind-1");

const publication = {
  renderPage,
  publish: OperationsApi.publishIndicator,
  load: OperationsApi.getIndicatorById,
  entity: indicator,
};

describe("Indicators view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi.getIndicatorById).mockResolvedValue(indicator);
    vi.mocked(OperationsApi.publishIndicator).mockResolvedValue({});
  });

  it("charge l'indicateur et résout sa fréquence", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("indicateur:Indicateur FR")).toBeInTheDocument());
    expect(screen.getByText("fréquence:Annuelle")).toBeInTheDocument();
    expect(OperationsApi.getIndicatorById).toHaveBeenCalledWith("ind-1");
  });

  it("laisse la fréquence vide quand le code ne correspond à rien", async () => {
    vi.mocked(OperationsApi.getIndicatorById).mockResolvedValue({
      ...indicator,
      accrualPeriodicityCode: "Z",
    });
    renderPage();

    await waitFor(() => expect(screen.getByText("fréquence:(aucune)")).toBeInTheDocument());
  });

  itPublishesThenReloads("publie l'indicateur puis le recharge", publication);

  itShowsPublicationError("affiche l'erreur serveur quand la publication échoue", publication);
});
