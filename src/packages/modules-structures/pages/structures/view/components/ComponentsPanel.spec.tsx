import { render, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";
import { useFormattedCodeList } from "../../../../hooks/useFormattedCodeList";
import { CodelistPanel } from "../../../../components/CodelistPanel";
import { StructureComponentsSelector } from "../../../../components/StructureComponentsSelector";
import { ComponentsPanel } from "./ComponentsPanel";

vi.mock("../../../../components/codes-list-panel/codes-list-panel", () => ({
  CodelistPanel: vi.fn(() => <div data-testid="codes-list-panel">CodelistPanel Mock</div>),
}));

vi.mock("../../../../components/structure-component-selector", () => ({
  StructureComponentsSelector: vi.fn(() => (
    <div data-testid="codes-list-panel">Structure Component Selector Mock</div>
  )),
}));

vi.mock("../../../../components/component-specification-modal/index", () => ({
  ComponentSpecificationModal: vi.fn(() => (
    <div data-testid="component-specification-modal">ComponentSpecificationModal Mock</div>
  )),
}));

vi.mock("../../../../hooks/useFormattedCodeList", () => ({
  useFormattedCodeList: vi.fn(),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
}));

describe("ComponentsPanel", () => {
  beforeEach(() => {
    (useFormattedCodeList as Mock).mockReturnValue({ data: [] });
    (ConceptsApi.getConceptList as Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render StructureComponentsSelector and CodesListPanel", async () => {
    render(<ComponentsPanel componentDefinitions={[]} />);

    await waitFor(() => {
      expect((StructureComponentsSelector as Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      expect((CodelistPanel as Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});
