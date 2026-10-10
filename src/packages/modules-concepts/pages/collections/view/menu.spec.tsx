import { render, screen } from "@testing-library/react";

import { UNPUBLISHED } from "@model/ValidationState";

import { PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

const renderMenu = async (privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[]) => {
  mockReactQueryForRbac([{ application: "CONCEPT_COLLECTION", privileges }]);

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
};

describe("collection-visualization-controls", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("a user can go back", async () => {
    await renderMenu([
      { privilege: "READ", strategy: "ALL" },
      { privilege: "UPDATE", strategy: "ALL" },
      { privilege: "PUBLISH", strategy: "ALL" },
    ]);

    screen.getByText("Back");
    screen.getByText("Export");
    screen.getByText("Update");
    screen.getByText("Publish");
  });

  it("a user without Admin or  Proprietaire_collection_concepts_RMESGNCS role cannot update a collection", async () => {
    await renderMenu([]);

    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
  });
});
