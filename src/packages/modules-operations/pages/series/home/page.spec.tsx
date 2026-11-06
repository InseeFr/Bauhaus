import { screen } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import {
  expectEmptyList,
  expectListSortedByLabel,
  expectLoading,
  renderAtRoute,
} from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api");

vi.mock("./components/SeriesHome", async () => {
  const { LabelList } = await import("../../page.testing");
  return { SeriesHome: ({ series }: any) => <LabelList items={series} /> };
});

const renderPage = () => renderAtRoute(<Component />, "/series", "/series");

describe("Series home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getSeriesList).mockReturnValue(new Promise(() => {}) as any);
    renderPage();

    expectLoading();
  });

  it("trie les séries par libellé", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([
      { id: "s-2", label: "Zèbre" },
      { id: "s-1", label: "Abeille" },
    ] as any);
    renderPage();

    await expectListSortedByLabel();
  });

  it("affiche une liste vide quand il n'y a aucune série", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([] as any);
    renderPage();

    await expectEmptyList();
  });

  it("affiche l'échec de chargement de la liste au lieu d'une liste vide", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockRejectedValue(sdkRejection.emptyBody(500));
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
