import { render, screen } from "@testing-library/react";
import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";
import { UNPUBLISHED, VALIDATED } from "@model/ValidationState";

describe("concept-visualization-controls", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders Back and Export buttons for any user", async () => {
    mockReactQueryForRbac([{ application: "CONCEPT_CONCEPT", privileges: [] }]);

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={1}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Compare")).toBeNull();
  });

  it("renders Compare button when user has READ privilege and conceptVersion > 1", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_CONCEPT",
        privileges: [{ privilege: "READ", strategy: "ALL" }],
      },
    ]);

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={2}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("does not render Compare button when user has no READ privilege", async () => {
    mockReactQueryForRbac([{ application: "CONCEPT_CONCEPT", privileges: [] }]);

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={2}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.queryByText("Compare")).toBeNull();
  });

  it("renders Update and Delete buttons for a user with UPDATE and DELETE privileges", async () => {
    mockReactQueryForRbac(
      [
        {
          application: "CONCEPT_CONCEPT",
          privileges: [
            { privilege: "UPDATE", strategy: "STAMP" },
            { privilege: "DELETE", strategy: "STAMP" },
          ],
        },
      ],
      [{ stamp: "DG75-L201" }],
    );

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={1}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders Publish button when user has PUBLISH privilege and concept is not validated", async () => {
    mockReactQueryForRbac(
      [
        {
          application: "CONCEPT_CONCEPT",
          privileges: [{ privilege: "PUBLISH", strategy: "STAMP" }],
        },
      ],
      [{ stamp: "DG75-L201" }],
    );

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={1}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("does not render Publish button when concept is already validated", async () => {
    mockReactQueryForRbac(
      [
        {
          application: "CONCEPT_CONCEPT",
          privileges: [{ privilege: "PUBLISH", strategy: "STAMP" }],
        },
      ],
      [{ stamp: "DG75-L201" }],
    );

    const { default: ConceptVisualizationControls } = await import("./menu");

    render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={VALIDATED}
          conceptVersion={1}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.queryByText("Publish")).toBeNull();
  });

  it("all buttons have an SVG icon", async () => {
    mockReactQueryForRbac(
      [
        {
          application: "CONCEPT_CONCEPT",
          privileges: [
            { privilege: "READ", strategy: "ALL" },
            { privilege: "UPDATE", strategy: "STAMP" },
            { privilege: "DELETE", strategy: "STAMP" },
            { privilege: "PUBLISH", strategy: "STAMP" },
          ],
        },
      ],
      [{ stamp: "DG75-L201" }],
    );

    const { default: ConceptVisualizationControls } = await import("./menu");

    const { container } = render(
      <WithRouter>
        <ConceptVisualizationControls
          id="c1"
          general={{ creator: "DG75-L201" }}
          validationState={UNPUBLISHED}
          conceptVersion={2}
          onValidate={vi.fn()}
          onDelete={vi.fn()}
        />
      </WithRouter>,
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
