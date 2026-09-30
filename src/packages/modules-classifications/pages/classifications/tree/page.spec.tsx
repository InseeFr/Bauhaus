import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { useClassificationsItem } from "@utils/hooks/classifications";
import { useSecondLang } from "@utils/hooks/second-lang";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("react-router-dom", async () =>
  (await import("../../../testing/router.testing")).withMockedParams(() => ({ id: "nafr2" })),
);

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

const renderPage = () => renderClassificationsPage(<Component />);

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

  it("indique que la nomenclature est introuvable au lieu de charger indéfiniment", async () => {
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockRejectedValue(
      sdkRejection.emptyBody(404),
    );
    renderPage();

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que l'arbre n'a pas pu être chargé", async () => {
    vi.mocked(useClassificationsItem).mockReturnValue({
      isLoading: false,
      data: undefined,
      error: sdkRejection.emptyBody(500),
    } as any);
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByText(/^titre:/)).not.toBeInTheDocument();
  });

  it("attend aussi le chargement de l'arbre", () => {
    vi.mocked(useClassificationsItem).mockReturnValue({ isLoading: true, data: undefined } as any);
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
