import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ConceptsApi, StructureApi } from "@sdk/index";

import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../../../../constants";
import { StructureComponents } from "./StructureComponents";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: { getConceptList: vi.fn() },
  StructureApi: { getMutualizedComponents: vi.fn() },
}));

vi.mock("../../../../hooks/useFormattedCodelist", () => ({
  useFormattedCodelist: () => ({ data: [{ id: "CL_1" }] }),
}));

vi.mock("../../../../components/ComponentSelector", () => ({
  ComponentSelector: ({ type, concepts, mutualizedComponents, codelists, structure }: any) => (
    <div data-testid={type}>
      concepts:{concepts.length}|mutualisées:{mutualizedComponents.length}|listes:
      {codelists.length}|structure:{structure.id ?? "(aucune)"}
    </div>
  ),
}));

const onChange = vi.fn();

describe("StructureComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([{ id: "k-1" }, { id: "k-2" }]);
    vi.mocked(StructureApi.getMutualizedComponents).mockResolvedValue([{ id: "c-1" }]);
  });

  it("propose un sélecteur par type de composante", async () => {
    render(<StructureComponents componentDefinitions={[]} onChange={onChange} />);

    await waitFor(() => expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toBeInTheDocument());
    expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toBeInTheDocument();
    expect(screen.getByTestId(ATTRIBUTE_PROPERTY_TYPE)).toBeInTheDocument();
  });

  it("alimente chaque sélecteur des mêmes référentiels", async () => {
    render(<StructureComponents componentDefinitions={[]} onChange={onChange} />);

    await waitFor(() =>
      expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toHaveTextContent(
        "concepts:2|mutualisées:1|listes:1",
      ),
    );
  });

  it("part d'une structure vide quand aucune n'est fournie", async () => {
    render(<StructureComponents componentDefinitions={[]} onChange={onChange} />);

    await waitFor(() =>
      expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toHaveTextContent("structure:(aucune)"),
    );
  });

  it("transmet la structure en cours d'édition", async () => {
    render(
      <StructureComponents
        componentDefinitions={[]}
        onChange={onChange}
        structure={{ id: "str-1" }}
      />,
    );

    await waitFor(() =>
      expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toHaveTextContent("structure:str-1"),
    );
  });
});
