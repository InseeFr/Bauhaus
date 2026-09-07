import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => params(),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getOperation: vi.fn(), publishOperation: vi.fn() },
}));

vi.mock("./components/OperationsOperationVisualization", () => ({
  OperationsOperationVisualization: ({ attr }) => <div>opération:{attr.prefLabelLg1}</div>,
}));
vi.mock("./menu", () => ({
  Menu: ({ onPublish }) => <button onClick={onPublish}>publier</button>,
}));

const operation = { id: "op-1", prefLabelLg1: "Opération FR", prefLabelLg2: "Operation EN" };

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Operations view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id: "op-1" });
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
    params.mockReturnValue({});
    renderPage();

    await waitFor(() => expect(screen.getByText(/Loading/i)).toBeInTheDocument());
    expect(OperationsApi.getOperation).not.toHaveBeenCalled();
  });

  it("publie l'opération puis la recharge", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(OperationsApi.publishOperation).toHaveBeenCalledWith(operation));
    await waitFor(() => expect(OperationsApi.getOperation).toHaveBeenCalledTimes(2));
  });

  it("affiche l'erreur serveur quand la publication échoue", async () => {
    vi.mocked(OperationsApi.publishOperation).mockRejectedValue("Publication refusée");
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(screen.getByText("Publication refusée")).toBeInTheDocument());
  });
});
