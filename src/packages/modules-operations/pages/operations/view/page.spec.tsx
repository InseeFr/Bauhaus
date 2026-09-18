import { screen, waitFor } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { itPublishesThenReloads, itShowsPublicationError, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getOperation: vi.fn(), publishOperation: vi.fn() },
}));

vi.mock("./components/OperationsOperationVisualization", () => ({
  OperationsOperationVisualization: ({ attr }: any) => <div>opération:{attr.prefLabelLg1}</div>,
}));
vi.mock("./menu", async () => (await import("../../page.testing")).publishMenuModule("onPublish"));

const operation = { id: "op-1", prefLabelLg1: "Opération FR", prefLabelLg2: "Operation EN" };

const renderPage = (url = "/operation/op-1") =>
  renderAtRoute(<Component />, "/operation/:id?", url);

const publication = {
  renderPage,
  publish: OperationsApi.publishOperation,
  load: OperationsApi.getOperation,
  entity: operation,
};

describe("Operations view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi.getOperation).mockResolvedValue(operation);
    vi.mocked(OperationsApi.publishOperation).mockResolvedValue({});
  });

  it("charge l'opération et l'affiche", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("opération:Opération FR")).toBeInTheDocument());
    expect(OperationsApi.getOperation).toHaveBeenCalledWith("op-1");
  });

  it("ne demande rien sans identifiant dans l'URL", async () => {
    renderPage("/operation");

    await waitFor(() => expect(screen.getByText(/Loading/i)).toBeInTheDocument());
    expect(OperationsApi.getOperation).not.toHaveBeenCalled();
  });

  itPublishesThenReloads("publie l'opération puis la recharge", publication);

  itShowsPublicationError("affiche l'erreur serveur quand la publication échoue", publication);
});
