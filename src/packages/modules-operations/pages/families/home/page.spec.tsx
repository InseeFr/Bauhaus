import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({ OperationsApi: { getAllFamilies: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("@components/searchable-list", () => import("../../../../tests/searchable-list.testing"));
vi.mock("../../../../auth/components/auth", () => ({ HasAccess: () => null }));

const renderPage = () => renderAtRoute(<Component />, "/families", "/families");

describe("Families home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getAllFamilies).mockReturnValue(new Promise(() => {}) as any);
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("liste les familles, chacune menant à sa fiche", async () => {
    vi.mocked(OperationsApi.getAllFamilies).mockResolvedValue([
      { id: "f-1", label: "Enquêtes ménages" },
    ] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("Enquêtes ménages")).toBeInTheDocument());
    expect(screen.getByTestId("searchable-list")).toHaveAttribute("data-path", "operations/family");
  });

  it("affiche l'échec de chargement de la liste au lieu d'une liste vide", async () => {
    vi.mocked(OperationsApi.getAllFamilies).mockRejectedValue(sdkRejection.emptyBody(500));
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByTestId("searchable-list")).not.toBeInTheDocument();
  });
});
