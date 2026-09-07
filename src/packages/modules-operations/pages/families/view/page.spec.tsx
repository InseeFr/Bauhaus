import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => ({ id: "fam-1" }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getFamilyById: vi.fn(), publishFamily: vi.fn() },
}));

vi.mock("./components/OperationsFamilyVisualization", () => ({
  OperationsFamilyVisualization: ({ attr }: any) => <div>famille:{attr.prefLabelLg1}</div>,
}));
vi.mock("./menu", () => ({
  Menu: ({ publish }: any) => <button onClick={publish}>publier</button>,
}));

const family = { id: "fam-1", prefLabelLg1: "Famille FR", prefLabelLg2: "Family EN" };

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

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

  it("publie la famille puis la recharge", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(OperationsApi.publishFamily).toHaveBeenCalledWith(family));
    await waitFor(() => expect(OperationsApi.getFamilyById).toHaveBeenCalledTimes(2));
  });

  it("affiche l'erreur serveur quand la publication échoue", async () => {
    vi.mocked(OperationsApi.publishFamily).mockRejectedValue("Publication refusée");
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(screen.getByText("Publication refusée")).toBeInTheDocument());
    expect(screen.getByText("famille:Famille FR")).toBeInTheDocument();
  });
});
