import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => ({ id: "ind-1" }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getIndicatorById: vi.fn(), publishIndicator: vi.fn() },
}));

vi.mock("@utils/hooks/codeslist", () => ({
  useCodesList: () => ({ codes: [{ code: "A", labelLg1: "Annuelle" }] }),
}));

vi.mock("./components/OperationsIndicatorVisualization", () => ({
  OperationsIndicatorVisualization: ({ attr, frequency }) => (
    <div>
      <span>indicateur:{attr.prefLabelLg1}</span>
      <span>fréquence:{frequency?.labelLg1 ?? "(aucune)"}</span>
    </div>
  ),
}));
vi.mock("./menu", () => ({
  Menu: ({ publish }) => <button onClick={publish}>publier</button>,
}));

const indicator = {
  id: "ind-1",
  prefLabelLg1: "Indicateur FR",
  prefLabelLg2: "Indicator EN",
  accrualPeriodicityCode: "A",
};

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

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

  it("publie l'indicateur puis le recharge", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(OperationsApi.publishIndicator).toHaveBeenCalledWith(indicator));
    await waitFor(() => expect(OperationsApi.getIndicatorById).toHaveBeenCalledTimes(2));
  });

  it("affiche l'erreur serveur quand la publication échoue", async () => {
    vi.mocked(OperationsApi.publishIndicator).mockRejectedValue("Publication refusée");
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(screen.getByText("Publication refusée")).toBeInTheDocument());
  });
});
