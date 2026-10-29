import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/concepts-api";

import { conceptListQuery } from "@utils/hooks/concepts";

import { createQueryClient } from "../../../../../application/query-client";
import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
import { CodelistPanel } from "../../../../components/CodelistPanel";
import { StructureComponentsSelector } from "../../../../components/StructureComponentsSelector";
import { useFormattedCodelist } from "../../../../hooks/useFormattedCodelist";
import { ComponentsPanel } from "./ComponentsPanel";

vi.mock("../../../../components/CodelistPanel", () => ({
  CodelistPanel: vi.fn(() => <div data-testid="code-list-panel">CodelistPanel Mock</div>),
}));

vi.mock("../../../../components/StructureComponentsSelector", () => ({
  StructureComponentsSelector: vi.fn(() => (
    <div data-testid="code-list-panel">Structure Component Selector Mock</div>
  )),
}));

vi.mock("../../../../components/component-specification-modal/index", () => ({
  ComponentSpecificationModal: vi.fn(() => (
    <div data-testid="component-specification-modal">ComponentSpecificationModal Mock</div>
  )),
}));

vi.mock("../../../../hooks/useFormattedCodelist", () => ({
  useFormattedCodelist: vi.fn(),
}));

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
}));

const NO_COMPONENT_DEFINITIONS: never[] = [];

const renderWithQueryClient = (ui: ReactElement, queryClient = new QueryClient()) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

describe("ComponentsPanel", () => {
  beforeEach(() => {
    (useFormattedCodelist as Mock).mockReturnValue({ data: [] });
    (ConceptsApi.getConceptList as Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ne pose aucune classe Bootstrap", async () => {
    renderWithQueryClient(<ComponentsPanel componentDefinitions={NO_COMPONENT_DEFINITIONS} />);
    await waitFor(() => expect(CodelistPanel).toHaveBeenCalled());
    expectNoBootstrapClass();
  });

  it("transmet les concepts lus au sélecteur de composantes", async () => {
    (ConceptsApi.getConceptList as Mock).mockResolvedValue([{ id: "k-1", label: "Concept" }]);

    renderWithQueryClient(<ComponentsPanel componentDefinitions={NO_COMPONENT_DEFINITIONS} />);

    await waitFor(() =>
      expect(StructureComponentsSelector).toHaveBeenLastCalledWith(
        expect.objectContaining({ concepts: [{ id: "k-1", label: "Concept" }] }),
        undefined,
      ),
    );
  });

  it("reprend la liste des concepts lue il y a moins d'une minute par un autre écran", async () => {
    const cached = [{ id: "k-2", label: "En cache", altLabel: "", _links: { self: { href: "" } } }];
    const queryClient = createQueryClient();
    queryClient.setQueryData(conceptListQuery().queryKey, cached);

    renderWithQueryClient(
      <ComponentsPanel componentDefinitions={NO_COMPONENT_DEFINITIONS} />,
      queryClient,
    );

    expect(StructureComponentsSelector).toHaveBeenLastCalledWith(
      expect.objectContaining({ concepts: cached }),
      undefined,
    );
    expect(ConceptsApi.getConceptList).not.toHaveBeenCalled();
  });

  it("should render StructureComponentsSelector and CodelistPanel", async () => {
    renderWithQueryClient(<ComponentsPanel componentDefinitions={NO_COMPONENT_DEFINITIONS} />);

    await waitFor(() => {
      expect((StructureComponentsSelector as Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      expect((CodelistPanel as Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});
