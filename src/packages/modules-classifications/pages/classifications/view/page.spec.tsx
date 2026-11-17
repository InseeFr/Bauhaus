import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { params } from "../../../testing/params.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getClassificationGeneral: vi.fn(),
    getClassificationLevels: vi.fn(),
    publishClassification: vi.fn(),
  },
}));

vi.mock("./components/ClassificationVisualization", () => ({
  ClassificationVisualization: ({ classification }: any) => (
    <h1>nomenclature:{classification.general.prefLabelLg1}</h1>
  ),
}));

const renderPage = () => renderClassificationsPage(<Component />, { withQueryClient: true });

describe("Classification view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id: "nafr2" });
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockResolvedValue({
      prefLabelLg1: "NAF rév. 2",
    } as any);
    vi.mocked(ClassificationsApi.getClassificationLevels).mockResolvedValue([] as any);
  });

  it("affiche la nomenclature demandée dans l'URL", async () => {
    renderPage();

    expect(await screen.findByText("nomenclature:NAF rév. 2")).toBeInTheDocument();
    expect(ClassificationsApi.getClassificationGeneral).toHaveBeenCalledWith("nafr2");
  });

  it("indique que la nomenclature est introuvable au lieu de charger indéfiniment", async () => {
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockRejectedValue(
      sdkRejection.json(404, { message: "Classification not found" }),
    );

    renderPage();

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que la nomenclature n'a pas pu être chargée quand ses niveaux échouent", async () => {
    vi.mocked(ClassificationsApi.getClassificationLevels).mockRejectedValue(
      sdkRejection.emptyBody(500),
    );

    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByText(/^nomenclature:/)).not.toBeInTheDocument();
  });
});
