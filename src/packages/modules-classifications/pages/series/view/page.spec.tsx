import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";
import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => ({ id: "ser-1" }),
}));

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getSeriesGeneral: vi.fn(), getSeriesMembers: vi.fn() },
}));

vi.mock("./components/SeriesVisualization", () => ({
  SeriesVisualization: ({ series, secondLang }: any) => (
    <div>
      <span>libellé:{series.general.prefLabelLg1 ?? "(aucun)"}</span>
      <span>membres:{series.members.length}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  ),
}));

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Classifications series view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ClassificationsApi.getSeriesGeneral).mockResolvedValue({ prefLabelLg1: "Série NAF" });
    vi.mocked(ClassificationsApi.getSeriesMembers).mockResolvedValue([
      { id: "m-1", labelLg1: "Membre 1" },
      { id: "m-2", labelLg1: "Membre 2" },
    ]);
  });

  it("attend les deux appels avant d'afficher quoi que ce soit", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("libellé:Série NAF")).toBeInTheDocument());
    expect(screen.getByText("membres:2")).toBeInTheDocument();
    expect(ClassificationsApi.getSeriesGeneral).toHaveBeenCalledWith("ser-1");
    expect(ClassificationsApi.getSeriesMembers).toHaveBeenCalledWith("ser-1");
  });

  it("tolère une réponse vide de part et d'autre", async () => {
    vi.mocked(ClassificationsApi.getSeriesGeneral).mockResolvedValue(undefined as any);
    vi.mocked(ClassificationsApi.getSeriesMembers).mockResolvedValue(undefined as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("membres:0")).toBeInTheDocument());
    expect(screen.getByText("libellé:(aucun)")).toBeInTheDocument();
  });

  it("passe l'état de seconde langue à la vue", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByText("secondeLangue:false")).toBeInTheDocument());
  });
});
