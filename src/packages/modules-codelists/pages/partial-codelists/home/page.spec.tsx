import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/codelists-api";

import { expectNoBootstrapClass } from "../../../../tests/bootstrap-classes.testing";
import { renderWithProviders } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("@sdk/codelists-api", () => ({ CodelistsApi: { getCodelistsPartial: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));
vi.mock("../../../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: React.ReactNode }) => children,
}));

describe("page d'accueil des listes de codes partielles", () => {
  it("ne pose aucune classe Bootstrap", async () => {
    vi.mocked(CodelistsApi.getCodelistsPartial).mockResolvedValue([
      { id: "cl1", labelLg1: "Liste partielle" },
    ]);
    renderWithProviders(<Component />);

    await screen.findByText(/Liste partielle/);
    expectNoBootstrapClass();
  });
});
