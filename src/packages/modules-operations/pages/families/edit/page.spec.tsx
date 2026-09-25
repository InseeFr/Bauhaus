import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@utils/hooks/useGoBack");
vi.mock("@utils/hooks/useTitle");

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getFamilyById: vi.fn(),
  },
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div>Loading...</div>,
}));

vi.mock("./components/OperationsFamilyEdition", () => ({
  OperationsFamilyEdition: () => <div>Operations Family Edition Component</div>,
}));

const renderPage = () => renderAtRoute(<Component />, "/family/:id/modify", "/family/123/modify");

describe("Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading component when family data is not yet loaded", async () => {
    (OperationsApi.getFamilyById as Mock).mockResolvedValueOnce({});

    renderPage();

    screen.getByText("Loading...");
  });

  it("should set title and display OperationsFamilyEdition component when family data is loaded", async () => {
    const familyData = { id: "123", prefLabelLg1: "Test Family" };
    (OperationsApi.getFamilyById as Mock).mockResolvedValueOnce(familyData);
    (useGoBack as Mock).mockReturnValue(vi.fn());

    renderPage();

    await screen.findByText("Operations Family Edition Component");

    expect(useTitle).toHaveBeenCalledWith(expect.stringContaining(" - "), familyData.prefLabelLg1);

    screen.getByText("Operations Family Edition Component");
  });
});
