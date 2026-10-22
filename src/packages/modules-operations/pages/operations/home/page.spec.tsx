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

vi.mock("./components/OperationsHome", async () => {
  const { LabelList } = await import("../../page.testing");
  return { OperationsHome: ({ operations }: any) => <LabelList items={operations} /> };
});

const renderPage = () => renderAtRoute(<Component />, "/operations", "/operations");

describe("Operations home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getOperationsList).mockReturnValue(new Promise(() => {}));
    renderPage();

    expectLoading();
  });

  it("trie les opérations par libellé", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([
      { id: "o-2", label: "Zèbre" },
      { id: "o-1", label: "Abeille" },
    ]);
    renderPage();

    await expectListSortedByLabel();
  });

  it("affiche une liste vide quand il n'y a aucune opération", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([]);
    renderPage();

    await expectEmptyList();
  });

  it("affiche l'échec de chargement de la liste au lieu d'une liste vide", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockRejectedValue(sdkRejection.emptyBody(500));
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
