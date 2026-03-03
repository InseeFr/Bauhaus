import { vi } from "vitest";

import { Structure } from "../../model/structures/Structure";
import { mockReactQueryForRbac, renderWithAppContext } from "../../tests/render";

vi.mock("./components/global-informations-panel", () => ({
  GlobalInformationsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/descriptions-panel", () => ({
  DescriptionsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/components-panel", () => ({
  ComponentsPanel: vi.fn(() => <div></div>),
}));

describe("<StructureView />", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("should display labelLg1", async () => {
    mockReactQueryForRbac([]);
    const { StructureView } = await import("./index");

    const { container } = renderWithAppContext(
      <StructureView
        publish={vi.fn()}
        structure={
          {
            labelLg1: "labelLg1",
          } as Structure
        }
      ></StructureView>,
    );

    expect(container.querySelector("h2")!.innerHTML).toEqual("labelLg1");
  });
});
