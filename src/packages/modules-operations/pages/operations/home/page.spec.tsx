import { render } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { expectEmptyList, expectListSortedByLabel, expectLoading } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api");

vi.mock("./components/OperationsHome", async () => {
  const { LabelList } = await import("../../page.testing");
  return { OperationsHome: ({ operations }: any) => <LabelList items={operations} /> };
});

describe("Operations home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getOperationsList).mockReturnValue(new Promise(() => {}));
    render(<Component />);

    expectLoading();
  });

  it("trie les opérations par libellé", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([
      { id: "o-2", label: "Zèbre" },
      { id: "o-1", label: "Abeille" },
    ]);
    render(<Component />);

    await expectListSortedByLabel();
  });

  it("affiche une liste vide quand il n'y a aucune opération", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([]);
    render(<Component />);

    await expectEmptyList();
  });
});
