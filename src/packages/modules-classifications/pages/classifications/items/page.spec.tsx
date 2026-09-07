import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";
import { AppContextProvider } from "../../../../application/app-context";
import { useSecondLang } from "@utils/hooks/second-lang";
import { Component } from "./page";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => params(),
}));

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getClassificationItems: vi.fn(), getClassificationGeneral: vi.fn() },
}));

vi.mock("@utils/hooks/second-lang", () => ({ useSecondLang: vi.fn() }));

vi.mock("./components/ClassificationItems", () => ({
  ClassificationItems: ({ items, subtitle, classificationId }: any) => (
    <div>
      <span>sous-titre:{subtitle ?? "(aucun)"}</span>
      <span>classification:{classificationId}</span>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
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

describe("Classification items page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id: "nafr2" });
    vi.mocked(useSecondLang).mockReturnValue([false, vi.fn()] as any);
    vi.mocked(ClassificationsApi.getClassificationItems).mockResolvedValue([
      { id: "01", labelLg1: "Agriculture", labelLg2: "Agriculture EN" },
      { id: "02", labelLg1: "Sylviculture", labelLg2: "Forestry" },
    ] as any);
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockResolvedValue({
      prefLabelLg1: "NAF rév. 2",
      prefLabelLg2: "NAF rev. 2",
    } as any);
  });

  it("préfixe chaque poste de son identifiant, et titre avec la première langue", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("01 - Agriculture")).toBeInTheDocument());
    expect(screen.getByText("02 - Sylviculture")).toBeInTheDocument();
    expect(screen.getByText("sous-titre:NAF rév. 2")).toBeInTheDocument();
    expect(screen.getByText("classification:nafr2")).toBeInTheDocument();
  });

  it("bascule libellés et titre en seconde langue", async () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("01 - Agriculture EN")).toBeInTheDocument());
    expect(screen.getByText("sous-titre:NAF rev. 2")).toBeInTheDocument();
  });

  it("n'affiche aucun poste quand la seconde langue n'est pas renseignée", async () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()] as any);
    vi.mocked(ClassificationsApi.getClassificationItems).mockResolvedValue([
      { id: "01", labelLg1: "Agriculture" },
    ] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("classification:nafr2")).toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("affiche une liste vide quand la classification n'a aucun poste", async () => {
    vi.mocked(ClassificationsApi.getClassificationItems).mockResolvedValue([] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("classification:nafr2")).toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
