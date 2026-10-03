import { render, screen } from "@testing-library/react";
import { useParams } from "react-router";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { Component } from "./page";

vi.mock("react-router", () => ({
  useParams: vi.fn(),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    getConceptGeneral: vi.fn(),
    getNoteVersionList: vi.fn(),
  },
}));

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="concept-loading">Loading...</div>,
}));

vi.mock("./components/ConceptCompare", () => ({
  ConceptCompare: () => <div data-testid="concept-compare">Compare</div>,
}));

describe("Concept compare page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({ id: "c1" });
    (useSecondLang as Mock).mockReturnValue([false, vi.fn()]);
  });

  it("renders the comparison once the concept and its notes are loaded", async () => {
    (ConceptsApi.getConceptGeneral as Mock).mockResolvedValue({ conceptVersion: "2" });
    (ConceptsApi.getNoteVersionList as Mock).mockResolvedValue({});

    render(<Component />);

    expect(await screen.findByTestId("concept-compare")).toBeInTheDocument();
    expect(ConceptsApi.getNoteVersionList).toHaveBeenCalledTimes(2);
  });

  it("says the concept could not be found instead of loading forever on a 404", async () => {
    (ConceptsApi.getConceptGeneral as Mock).mockRejectedValue(sdkRejection.emptyBody(404));

    render(<Component />);

    await expectItemNotFound();
    expect(screen.queryByTestId("concept-loading")).not.toBeInTheDocument();
  });

  it("says the concept could not be loaded when its notes cannot be read", async () => {
    (ConceptsApi.getConceptGeneral as Mock).mockResolvedValue({ conceptVersion: "1" });
    (ConceptsApi.getNoteVersionList as Mock).mockRejectedValue(sdkRejection.emptyBody(500));

    render(<Component />);

    await expectItemLoadFailed();
    expect(screen.queryByTestId("concept-compare")).not.toBeInTheDocument();
  });
});
