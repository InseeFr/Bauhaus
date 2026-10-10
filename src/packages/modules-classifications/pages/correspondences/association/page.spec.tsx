import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { params } from "../../../testing/params.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getCorrespondenceAssociation: vi.fn() },
}));

vi.mock("./components/AssociationHome", () => ({
  AssociationHome: ({ association }: any) => <h1>association:{association.labelLg1}</h1>,
}));

const renderPage = () => renderClassificationsPage(<Component />, { withQueryClient: true });

describe("Correspondence association page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ correspondenceId: "corr-1", associationId: "assoc-1" });
    vi.mocked(ClassificationsApi.getCorrespondenceAssociation).mockResolvedValue({
      labelLg1: "01 vers 01.1",
    } as any);
  });

  it("affiche l'association demandée dans l'URL", async () => {
    renderPage();

    expect(await screen.findByText("association:01 vers 01.1")).toBeInTheDocument();
    expect(ClassificationsApi.getCorrespondenceAssociation).toHaveBeenCalledWith(
      "corr-1",
      "assoc-1",
    );
  });

  it("indique que l'association est introuvable au lieu d'une page vide", async () => {
    vi.mocked(ClassificationsApi.getCorrespondenceAssociation).mockRejectedValue(
      sdkRejection.emptyBody(404),
    );

    renderPage();

    await expectItemNotFound();
    expect(screen.queryByText(/^association:/)).not.toBeInTheDocument();
  });
});
