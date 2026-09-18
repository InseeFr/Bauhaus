import { render } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { expectEmptyList, expectListSortedByLabel, expectLoading } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api");

vi.mock("./components/SeriesHome", async () => {
  const { LabelList } = await import("../../page.testing");
  return { SeriesHome: ({ series }: any) => <LabelList items={series} /> };
});

describe("Series home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getSeriesList).mockReturnValue(new Promise(() => {}) as any);
    render(<Component />);

    expectLoading();
  });

  it("trie les séries par libellé", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([
      { id: "s-2", label: "Zèbre" },
      { id: "s-1", label: "Abeille" },
    ] as any);
    render(<Component />);

    await expectListSortedByLabel();
  });

  it("affiche une liste vide quand il n'y a aucune série", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([] as any);
    render(<Component />);

    await expectEmptyList();
  });
});
