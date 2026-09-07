import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => ({ id: "s-1" }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getSerie: vi.fn(), publishSeries: vi.fn() },
}));

vi.mock("@utils/hooks/codeslist", () => ({
  useCodesList: (id) => ({
    codes:
      id === "CL_FREQ"
        ? [{ code: "A", labelLg1: "Annuelle" }]
        : [{ code: "SRC", labelLg1: "Enquête" }],
  }),
}));
vi.mock("@utils/hooks/organizations", () => ({ useOrganizations: () => ({ data: [] }) }));
vi.mock("@utils/hooks/useLocales", () => ({ useLocales: () => ["fr", "en"] }));

vi.mock("./components/OperationsSerieVisualization", () => ({
  OperationsSerieVisualization: ({ frequency, category }) => (
    <div>
      <span>fréquence:{frequency?.labelLg1 ?? "(aucune)"}</span>
      <span>catégorie:{category?.labelLg1 ?? "(aucune)"}</span>
    </div>
  ),
}));
vi.mock("./menu", () => ({
  Menu: ({ onPublish }) => <button onClick={onPublish}>publier</button>,
}));

const serie = {
  id: "s-1",
  prefLabelLg1: "Série FR",
  prefLabelLg2: "Series EN",
  accrualPeriodicityCode: "A",
  typeCode: "SRC",
};

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

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

  it("publie la série puis la recharge", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(OperationsApi.publishSeries).toHaveBeenCalledWith(serie));
    await waitFor(() => expect(OperationsApi.getSerie).toHaveBeenCalledTimes(2));
  });

  it("affiche l'erreur serveur quand la publication échoue, et sort de l'état publication", async () => {
    vi.mocked(OperationsApi.publishSeries).mockRejectedValue("Publication refusée");
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(screen.getByText("Publication refusée")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument();
  });
});
