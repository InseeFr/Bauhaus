import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as classificationHook from "../../../hooks/useClassificationItem";
import * as clientModule from "../../../hooks/useClassificationItemClient";
import { Component } from "./page";

// Mocks for APIs and SDK
vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    putClassificationItemGeneral: vi.fn(),
  },
}));

// Mocks for UI components
vi.mock("@components/rich-editor/editor-markdown", () => ({
  EditorMarkdown: () => <div>EditorMarkdown</div>,
}));
vi.mock("@components/select-rmes", () => ({
  Select: () => <select data-testid="Select" />,
}));
vi.mock("@components/form/input", () => ({
  TextInput: (props: any) => (
    <input data-testid={props.id} value={props.value} onChange={props.onChange} />
  ),
}));
vi.mock("@components/label-required", () => ({
  LabelRequired: (props: any) => <label>{props.children}</label>,
}));
vi.mock("@components/layout", () => ({
  Row: (props: any) => <div>{props.children}</div>,
}));
vi.mock("@components/loading", () => ({
  Loading: () => <div>Loading</div>,
  Saving: () => <div>Saving</div>,
}));
vi.mock("@components/page-title-block", () => ({
  PageTitleBlock: (props: any) => <h1>{props.titleLg1}</h1>,
}));
vi.mock("./menu", () => ({
  Menu: () => <div>Menu</div>,
}));
vi.mock("./validation", () => ({
  validate: () => ({}),
}));

const renderComponent = (params = { classificationId: "class1", itemId: "item1" }) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[
          `/classifications/classification/${params.classificationId}/item/${params.itemId}`,
        ]}
      >
        <Routes>
          <Route
            path="/classifications/classification/:classificationId/item/:itemId"
            element={<Component />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("<Component />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state when data is loading", () => {
    using _classificationHookSpy = vi
      .spyOn(classificationHook, "useClassificationItem")
      .mockReturnValue({
        isLoading: true,
      } as any);
    using _fetchSpy = vi.spyOn(clientModule, "fetchingPreviousLevels").mockResolvedValue([]);

    renderComponent();

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays form", () => {
    using _classificationHookSpy = vi
      .spyOn(classificationHook, "useClassificationItem")
      .mockReturnValue({
        isLoading: false,
        item: {
          general: {},
          notes: [],
        },
      } as any);

    using _parentLevelsSpy = vi
      .spyOn(classificationHook, "useClassificationParentLevels")
      .mockReturnValue({
        isLoading: false,
      } as any);

    using _fetchSpy = vi.spyOn(clientModule, "fetchingPreviousLevels").mockResolvedValue([]);

    renderComponent();

    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
  });
});
