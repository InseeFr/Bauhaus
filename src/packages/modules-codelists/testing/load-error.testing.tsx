import { screen } from "@testing-library/react";
import { ReactNode } from "react";
import { Mock, expect } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { renderWithProviders } from "./render.testing";

/**
 * Fait échouer en 404 la méthode `loader` de `CodelistsApi` (mockée par le spec),
 * rend `page` et vérifie que l'erreur serveur est affichée.
 */
export const expectLoadErrorDisplayed = async (
  loader: keyof typeof CodelistsApi,
  page: ReactNode,
) => {
  (CodelistsApi[loader] as Mock).mockRejectedValue({ message: "Codelist not found", status: 404 });

  renderWithProviders(page);

  expect(await screen.findByRole("alert")).toHaveTextContent("Codelist not found");
};
