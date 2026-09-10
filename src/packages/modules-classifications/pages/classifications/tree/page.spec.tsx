import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { useClassificationsItem } from "@utils/hooks/classifications";
import { useSecondLang } from "@utils/hooks/second-lang";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => ({ id: "nafr2" }),
}));

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getClassificationGeneral: vi.fn() },
}));
vi.mock("@utils/hooks/classifications", () => ({ useClassificationsItem: vi.fn() }));
vi.mock("@utils/hooks/second-lang", () => ({ useSecondLang: vi.fn() }));

vi.mock("./components/ClassificationTree", () => ({
  ClassificationTree: ({ prefLabel, data, secondLang }: any) => (
    <div>
      <span>titre:{prefLabel === "" ? "(vide)" : prefLabel}</span>
      <span>postes:{data?.length ?? "(aucun)"}</span>
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

describe("Classification tree page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSecondLang).mockReturnValue([false, vi.fn()] as any);
    vi.mocked(useClassificationsItem).mockReturnValue({
      isLoading: false,
      data: [{ id: "01" }, { id: "02" }],
    } as any);
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockResolvedValue({
      prefLabelLg1: "NAF rév. 2",
      prefLabelLg2: "NAF rev. 2",
    } as any);
  });

  it("affiche l'arbre une fois le général chargé", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("titre:NAF rév. 2")).toBeInTheDocument());
    expect(screen.getByText("postes:2")).toBeInTheDocument();
    expect(ClassificationsApi.getClassificationGeneral).toHaveBeenCalledWith("nafr2");
  });

  it("titre en seconde langue quand elle est active", async () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("titre:NAF rev. 2")).toBeInTheDocument());
    expect(screen.getByText("secondeLangue:true")).toBeInTheDocument();
  });

  it("retombe sur un titre vide quand la seconde langue n'est pas renseignée", async () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()] as any);
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockResolvedValue({
      prefLabelLg1: "NAF rév. 2",
    } as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("titre:(vide)")).toBeInTheDocument());
  });

  it("attend aussi le chargement de l'arbre", () => {
    vi.mocked(useClassificationsItem).mockReturnValue({ isLoading: true, data: undefined } as any);
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
