import { screen, waitFor } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { itPublishesThenReloads, itShowsPublicationError, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getFamilyById: vi.fn(), publishFamily: vi.fn() },
}));

vi.mock("./components/OperationsFamilyVisualization", () => ({
  OperationsFamilyVisualization: ({ attr }: any) => <div>famille:{attr.prefLabelLg1}</div>,
}));
vi.mock("./menu", async () => (await import("../../page.testing")).publishMenuModule("publish"));

const family = { id: "fam-1", prefLabelLg1: "Famille FR", prefLabelLg2: "Family EN" };

const renderPage = () => renderAtRoute(<Component />, "/family/:id", "/family/fam-1");

const publication = {
  renderPage,
  publish: OperationsApi.publishFamily,
  load: OperationsApi.getFamilyById,
  entity: family,
};

describe("Families view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi.getFamilyById).mockResolvedValue(family);
    vi.mocked(OperationsApi.publishFamily).mockResolvedValue({});
  });

  it("charge la famille et l'affiche", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("famille:Famille FR")).toBeInTheDocument());
    expect(OperationsApi.getFamilyById).toHaveBeenCalledWith("fam-1");
  });

  itPublishesThenReloads("publie la famille puis la recharge", publication);

  itShowsPublicationError("affiche l'erreur serveur quand la publication échoue", publication, () =>
    expect(screen.getByText("famille:Famille FR")).toBeInTheDocument(),
  );
});
