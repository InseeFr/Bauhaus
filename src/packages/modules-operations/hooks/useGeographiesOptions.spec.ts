import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useAllGeographies } from "./useAllGeographies";
import { useGeographiesOptions } from "./useGeographiesOptions";

vi.mock("./useAllGeographies", () => ({ useAllGeographies: vi.fn() }));

vi.mock("../i18n", () => ({
  operationsI18n: {
    t: (key: string, options: any) =>
      `${key}[${options.lng}]:${options.label}|${options.startDate ?? ""}|${options.endDate ?? ""}`,
  },
}));

const geography = (overrides: any = {}) => ({
  id: "g-1",
  uri: "http://bauhaus/geo/g-1",
  labelLg1: "France",
  labelLg2: "France EN",
  typeTerritory: "Pays",
  ...overrides,
});

const options = () => renderHook(() => useGeographiesOptions()).result.current.geographiesOptions;

describe("useGeographiesOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("trie les territoires par libellé, sans tenir compte de la casse", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [
        geography({ id: "g-2", labelLg1: "zone urbaine" }),
        geography({ id: "g-1", labelLg1: "Alsace" }),
      ],
    } as any);

    expect(options().map((option) => option.id)).toEqual(["g-1", "g-2"]);
  });

  it("écarte les territoires sans libellé", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [geography(), geography({ id: "g-2", labelLg1: "" })],
    } as any);

    expect(options()).toHaveLength(1);
  });

  it("expose l'URI en valeur, et conserve le territoire d'origine", () => {
    const geo = geography();
    vi.mocked(useAllGeographies).mockReturnValue({ isLoading: false, geographies: [geo] } as any);

    expect(options()[0]).toMatchObject({
      label: "France",
      labelLg2: "France EN",
      value: "http://bauhaus/geo/g-1",
      typeTerritory: "Pays",
      geography: geo,
    });
  });

  it("laisse le libellé nu quand il est unique, même daté", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [geography({ dateCreation: "2020", dateSuppression: "2024" })],
    } as any);

    expect(options()[0].label).toBe("France");
  });

  it("date les homonymes ayant une date de création et une de suppression", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [
        geography({ id: "g-1", dateCreation: "2020", dateSuppression: "2024" }),
        geography({ id: "g-2" }),
      ],
    } as any);

    expect(options()[0].label).toBe("geography.labelWithStartDateAndEndDate[fr]:France|2020|2024");
    expect(options()[0].labelLg2).toBe(
      "geography.labelWithStartDateAndEndDate[en]:France EN|2020|2024",
    );
  });

  it("ne date que le début pour un homonyme toujours en vigueur", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [geography({ id: "g-1", dateCreation: "2020" }), geography({ id: "g-2" })],
    } as any);

    expect(options()[0].label).toBe("geography.labelWithStartDate[fr]:France|2020|");
  });

  it("laisse le libellé nu pour un homonyme sans aucune date", () => {
    vi.mocked(useAllGeographies).mockReturnValue({
      isLoading: false,
      geographies: [geography({ id: "g-1" }), geography({ id: "g-2" })],
    } as any);

    expect(options()[0].label).toBe("France");
  });

  it("remonte l'état de chargement du référentiel", () => {
    vi.mocked(useAllGeographies).mockReturnValue({ isLoading: true, geographies: [] } as any);

    expect(renderHook(() => useGeographiesOptions()).result.current.isLoading).toBe(true);
  });
});
