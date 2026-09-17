import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("react-router-dom", async () =>
  (await import("../../../testing/router.testing")).withMockedParams(() => ({ id: "corr-1" })),
);

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getCorrespondenceGeneral: vi.fn(),
    getCorrespondenceAssociations: vi.fn(),
  },
}));

vi.mock("./components/HomeGeneral", () => ({
  HomeGeneral: ({ correspondence }: any) => (
    <h1>correspondance:{correspondence?.prefLabelLg1 ?? "(aucune)"}</h1>
  ),
}));
vi.mock("./components/HomeAssociations", () => ({
  HomeAssociations: ({ associations }: any) => <p>associations:{associations.length}</p>,
}));

const renderPage = () => renderClassificationsPage(<Component />, { withQueryClient: true });

describe("Correspondences view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ClassificationsApi.getCorrespondenceGeneral).mockResolvedValue({
      prefLabelLg1: "NAF vers CPF",
    } as any);
    vi.mocked(ClassificationsApi.getCorrespondenceAssociations).mockResolvedValue([
      { id: "a-1" },
    ] as any);
  });

  it("affiche le général puis les associations", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("correspondance:NAF vers CPF")).toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByText("associations:1")).toBeInTheDocument());
    expect(ClassificationsApi.getCorrespondenceGeneral).toHaveBeenCalledWith("corr-1");
  });

  it("affiche le général sans attendre les associations", async () => {
    vi.mocked(ClassificationsApi.getCorrespondenceAssociations).mockReturnValue(
      new Promise(() => {}) as any,
    );
    renderPage();

    await waitFor(() =>
      expect(screen.getByText("correspondance:NAF vers CPF")).toBeInTheDocument(),
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/^associations:/)).not.toBeInTheDocument();
  });
});
