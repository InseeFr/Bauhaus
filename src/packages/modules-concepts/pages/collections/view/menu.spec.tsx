import { render, screen } from "@testing-library/react";

import { UNPUBLISHED } from "@model/ValidationState";

import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

describe("collection-visualization-controls", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("a user can go back", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_COLLECTION",
        privileges: [
          { privilege: "READ", strategy: "ALL" },
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "PUBLISH", strategy: "ALL" },
        ],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          exportCollection={vi.fn() as () => void}
          handleValidation={vi.fn() as () => void}
          id={"1"}
          validationState={UNPUBLISHED}
        />
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Export");
    screen.getByText("Update");
    screen.getByText("Publish");
  });

  it("a user without Admin or  Proprietaire_collection_concepts_RMESGNCS role cannot update a collection", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_COLLECTION",
        privileges: [],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          exportCollection={vi.fn() as () => void}
          handleValidation={vi.fn() as () => void}
          id={"1"}
          validationState={UNPUBLISHED}
        />
      </WithRouter>,
    );

    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
  });
});
