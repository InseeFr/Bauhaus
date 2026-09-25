import { screen } from "@testing-library/react";
import { Mock } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { CL_FREQ } from "../../../../constants/code-lists";
import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

const { editionProps } = vi.hoisted(() => ({ editionProps: vi.fn() }));

vi.mock("@utils/hooks/useGoBack");
vi.mock("@utils/hooks/useTitle");
vi.mock("@utils/hooks/codelist");

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getIndicatorById: vi.fn(),
    getAllIndicators: vi.fn(),
    getSeriesList: vi.fn(),
  },
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div>Loading...</div>,
}));

vi.mock("./components/OperationsIndicatorEdition", () => ({
  OperationsIndicatorEdition: (props: unknown) => {
    editionProps(props);
    return <div>Operations Indicator Edition Component</div>;
  },
}));

const frequencies = { codes: [{ code: "A", labelLg1: "Annuelle" }] };

const indicator = {
  id: "i1",
  prefLabelLg1: "Mon indicateur",
  creators: ["DG75-L201"],
  publishers: [],
  contributors: [],
  wasGeneratedBy: [{ id: "s1", type: "series", labelLg1: "Ma série" }],
};

const indicators = [{ id: "i1", label: "Mon indicateur", altLabel: "MI" }];

const series = [{ iri: "http://.../s1", id: "s1", label: "Ma série", altLabel: "MS" }];

const goBack = vi.fn();

const renderCreation = () => renderAtRoute(<Component />, "/indicator/create", "/indicator/create");
const renderModification = () =>
  renderAtRoute(<Component />, "/indicator/:id/modify", "/indicator/i1/modify");

beforeEach(() => {
  (useCodelist as Mock).mockReturnValue(frequencies);
  (useGoBack as Mock).mockReturnValue(goBack);
  (OperationsApi.getAllIndicators as Mock).mockResolvedValue(indicators);
  (OperationsApi.getSeriesList as Mock).mockResolvedValue(series);
  (OperationsApi.getIndicatorById as Mock).mockResolvedValue(indicator);
});

describe("indicator edition page", () => {
  it("charge la liste des fréquences de collecte", () => {
    renderCreation();

    expect(useCodelist).toHaveBeenCalledWith(CL_FREQ);
  });

  it("attend l'indicateur avant d'afficher le formulaire en modification", () => {
    renderModification();

    screen.getByText("Loading...");
  });

  it("affiche le formulaire dès que l'indicateur est chargé", async () => {
    renderModification();

    await screen.findByText("Operations Indicator Edition Component");
    expect(OperationsApi.getIndicatorById).toHaveBeenCalledWith("i1");
  });

  it("affiche le formulaire sans attendre en création", async () => {
    renderCreation();

    await screen.findByText("Operations Indicator Edition Component");
    expect(OperationsApi.getIndicatorById).not.toHaveBeenCalled();
  });

  it("titre la page avec le libellé de l'indicateur édité", async () => {
    renderModification();

    await screen.findByText("Operations Indicator Edition Component");
    expect(useTitle).toHaveBeenLastCalledWith(expect.any(String), "Mon indicateur");
  });

  it("transmet au formulaire l'indicateur, les listes de rattachement et le retour", async () => {
    renderModification();

    await screen.findByText("Operations Indicator Edition Component");
    expect(editionProps).toHaveBeenLastCalledWith({
      indicator,
      indicators,
      series,
      frequencies,
      goBack,
    });
  });

  it("transmet un indicateur vide au formulaire en création", async () => {
    renderCreation();

    await screen.findByText("Operations Indicator Edition Component");
    expect(editionProps).toHaveBeenLastCalledWith(expect.objectContaining({ indicator: {} }));
  });
});
