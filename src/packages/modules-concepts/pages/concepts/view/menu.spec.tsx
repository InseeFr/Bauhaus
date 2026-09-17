import { render, screen } from "@testing-library/react";

import type { ValidationState } from "@components/status";

import { UNPUBLISHED, VALIDATED } from "@model/ValidationState";

import { PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

type Privileges = { privilege: PRIVILEGE; strategy: STRATEGY }[];

const OWNER_STAMPS = [{ stamp: "DG75-L201" }];

const renderControls = async (
  privileges: Privileges,
  {
    stamps,
    validationState = UNPUBLISHED,
    conceptVersion = 1,
  }: {
    stamps?: { stamp: string }[];
    validationState?: ValidationState;
    conceptVersion?: number;
  } = {},
) => {
  mockReactQueryForRbac([{ application: "CONCEPT_CONCEPT", privileges }], stamps);

  const { ConceptVisualizationControls } = await import("./menu");

  render(
    <WithRouter>
      <ConceptVisualizationControls
        id="c1"
        general={{ creator: "DG75-L201" }}
        validationState={validationState}
        conceptVersion={conceptVersion}
        onValidate={vi.fn()}
        onDelete={vi.fn()}
      />
    </WithRouter>,
  );
};

describe("concept-visualization-controls", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders Back and Export buttons for any user", async () => {
    await renderControls([]);

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Compare")).toBeNull();
  });

  it("renders Compare button when user has READ privilege and conceptVersion > 1", async () => {
    await renderControls([{ privilege: "READ", strategy: "ALL" }], { conceptVersion: 2 });

    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("does not render Compare button when user has no READ privilege", async () => {
    await renderControls([], { conceptVersion: 2 });

    expect(screen.queryByText("Compare")).toBeNull();
  });

  it("renders Update and Delete buttons for a user with UPDATE and DELETE privileges", async () => {
    await renderControls(
      [
        { privilege: "UPDATE", strategy: "STAMP" },
        { privilege: "DELETE", strategy: "STAMP" },
      ],
      { stamps: OWNER_STAMPS },
    );

    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders Publish button when user has PUBLISH privilege and concept is not validated", async () => {
    await renderControls([{ privilege: "PUBLISH", strategy: "STAMP" }], { stamps: OWNER_STAMPS });

    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("does not render Publish button when concept is already validated", async () => {
    await renderControls([{ privilege: "PUBLISH", strategy: "STAMP" }], {
      stamps: OWNER_STAMPS,
      validationState: VALIDATED,
    });

    expect(screen.queryByText("Publish")).toBeNull();
  });

  it("all buttons have an SVG icon", async () => {
    await renderControls(
      [
        { privilege: "READ", strategy: "ALL" },
        { privilege: "UPDATE", strategy: "STAMP" },
        { privilege: "DELETE", strategy: "STAMP" },
        { privilege: "PUBLISH", strategy: "STAMP" },
      ],
      { stamps: OWNER_STAMPS, conceptVersion: 2 },
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(
        button.querySelector("svg"),
        `Button "${button.textContent}" is missing an SVG icon`,
      ).not.toBeNull();
    });
  });
});
