import { ReactNode } from "react";
import { Mock, expect } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { expectItemNotFound } from "../../tests/loading-error.testing";
import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { renderWithProviders } from "./render.testing";

/**
 * Fait échouer en 404 la méthode `loader` de `CodelistsApi` (mockée par le spec), rend `page` et
 * vérifie que l'échec de chargement remplace l'écran (`LoadingErrorBloc`), au lieu d'un bandeau
 * au-dessus d'une fiche vide.
 */
export const expectLoadErrorDisplayed = async (
  loader: keyof typeof CodelistsApi,
  page: ReactNode,
) => {
  (CodelistsApi[loader] as Mock).mockRejectedValue(
    sdkRejection.json(404, { message: "Codelist not found" }),
  );

  const { container } = renderWithProviders(page);

  await expectItemNotFound();
  expect(container.querySelector(".alert-danger")).toBeNull();
};
