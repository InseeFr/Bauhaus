import { screen, waitFor } from "@testing-library/react";

import { DDIApi } from "@sdk/ddi-api";
import { OperationsApi } from "@sdk/operations-api";

import type { AppName } from "../../../../application/app-context";
import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { itPublishesThenReloads, itShowsPublicationError, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getOperation: vi.fn(), publishOperation: vi.fn() },
}));

vi.mock("@sdk/ddi-api", () => ({
  DDIApi: { getOperationPhysicalInstances: vi.fn() },
}));

let mockVisibleModules: AppName[] = [];
vi.mock("../../../../application/visible-modules", () => ({
  useVisibleModules: () => mockVisibleModules,
}));

vi.mock("./components/OperationsOperationVisualization", () => ({
  OperationsOperationVisualization: ({ attr, physicalInstances = [] }: any) => (
    <div>
      opération:{attr.prefLabelLg1}
      {physicalInstances.map((pi: any) => (
        <span key={pi.id}>fichier:{pi.label}</span>
      ))}
    </div>
  ),
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
    mockVisibleModules = ["operations"];
  });

  it("attend les fichiers de données DDI avant d'afficher l'opération", async () => {
    mockVisibleModules = ["operations", "ddi"];
    let resolvePhysicalInstances!: (rows: unknown[]) => void;
    vi.mocked(DDIApi.getOperationPhysicalInstances).mockReturnValue(
      new Promise((resolve) => (resolvePhysicalInstances = resolve)),
    );

    renderPage();

    await waitFor(() => expect(DDIApi.getOperationPhysicalInstances).toHaveBeenCalledWith("op-1"));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    resolvePhysicalInstances([{ id: "pi-1", label: "Individus", agency: "fr.insee" }]);

    await waitFor(() => expect(screen.getByText("fichier:Individus")).toBeInTheDocument());
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

  it("dit que l'opération n'a pu être chargée quand le serveur échoue", async () => {
    vi.mocked(OperationsApi.getOperation).mockRejectedValue(sdkRejection.emptyBody(500));

    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
});
