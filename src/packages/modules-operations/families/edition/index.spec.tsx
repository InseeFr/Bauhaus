import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { Component } from "./";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getFamilyById: vi.fn(),
  },
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div>Loading...</div>,
}));

vi.mock("./edition", () => ({
  default: () => <div>Operations Family Edition Component</div>,
}));

describe("Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading component when family data is not yet loaded", async () => {
    (useParams as Mock).mockReturnValue({ id: "123" });
    (OperationsApi.getFamilyById as Mock).mockResolvedValueOnce({});

    render(<Component />);

    screen.getByText("Loading...");
  });

  it("should set title and display OperationsFamilyEdition component when family data is loaded", async () => {
    const familyData = { id: "123", prefLabelLg1: "Test Family" };
    (useParams as Mock).mockReturnValue({ id: "123" });
    (OperationsApi.getFamilyById as Mock).mockResolvedValueOnce(familyData);
    (useGoBack as Mock).mockReturnValue(vi.fn());

    render(<Component />);

    await screen.findByText("Operations Family Edition Component");

    expect(useTitle).toHaveBeenCalledWith(expect.stringContaining(" - "), familyData.prefLabelLg1);

    screen.getByText("Operations Family Edition Component");
  });
});
