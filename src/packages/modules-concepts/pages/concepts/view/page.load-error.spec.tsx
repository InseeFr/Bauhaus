import { Route, Routes } from "react-router";
import { Mock, vi } from "vitest";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { renderWithAppContext } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useConcept } from "../../../hooks/useConcept";
import { Component } from "./page";

vi.mock("../../../hooks/useConcept", () => ({
  useConcept: vi.fn(),
}));

const PAGE = <Component />;

const renderPage = () =>
  renderWithAppContext(
    <Routes>
      <Route path="/" element={PAGE} />
    </Routes>,
  );

describe("Fiche d'un concept qui ne peut pas être chargée", () => {
  it("indique que le concept est introuvable sur un 404", async () => {
    (useConcept as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: sdkRejection.emptyBody(404),
      refetch: vi.fn(),
    });

    renderPage();

    await expectItemNotFound();
  });

  it("ne dit pas « introuvable » quand le serveur est en panne", async () => {
    (useConcept as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: sdkRejection.emptyBody(500),
      refetch: vi.fn(),
    });

    renderPage();

    await expectItemLoadFailed();
  });
});
