import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { mockReactQueryForRbac, renderWithAppContext } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  StructureApi: { getStructure: vi.fn() },
}));

vi.mock("./components/GlobalInformationsPanel", () => ({
  GlobalInformationsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/DescriptionsPanel", () => ({
  DescriptionsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/ComponentsPanel", () => ({
  ComponentsPanel: vi.fn(() => <div></div>),
}));

describe("<StructureView />", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("should display labelLg1", async () => {
    mockReactQueryForRbac([]);
    const { StructureView } = await import("./page");

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

describe("Structure view page", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("indique que la structure est introuvable au lieu d'une page vide", async () => {
    mockReactQueryForRbac([]);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(404));
    const { Component } = await import("./page");

    renderWithAppContext(<Component />);

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que la structure n'a pas pu être chargée", async () => {
    mockReactQueryForRbac([]);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(500));
    const { Component } = await import("./page");

    renderWithAppContext(<Component />);

    await expectItemLoadFailed();
  });
});
