import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createAppRouter, Routes } from "./routes";

/* Fichier séparé de routes.spec.tsx : le mock fait échouer toutes les pages derrière
   l'authentification, ce qui casserait les autres tests du routeur. */
vi.mock("../../auth/hoc", () => ({
  withAuth: () => () => {
    throw new Error("boom");
  },
}));

describe("createAppRouter", () => {
  it("shows the error page instead of React Router's default screen when a page fails", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<Routes router={createAppRouter([])} />);

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
  });
});
