import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Structure } from "@model/structures/Structure";
import { UNPUBLISHED } from "@model/ValidationState";

import { StructureApi } from "@sdk/index";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../../../tests/render";

vi.mock("@sdk/index", () => ({
  StructureApi: {
    deleteStructure: vi.fn(),
  },
}));

const renderControls = async (structure: Structure) => {
  const { Controls } = await import("./Controls");

  render(
    <WithRouter>
      <Controls structure={structure} publish={vi.fn()}></Controls>
    </WithRouter>,
  );
};

describe("Structure View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("should call handleDelete when DeleteButton is clicked", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [{ privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL }],
      },
    ]);

    StructureApi.deleteStructure.mockReturnValue(Promise.resolve());

    await renderControls({
      id: "1",
      contributor: "someStamp",
      validationState: UNPUBLISHED,
    } as Structure);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(StructureApi.deleteStructure).toHaveBeenCalledWith("1");
  });

  it("a user can only see the go back button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [],
      },
    ]);

    await renderControls({ id: "1" } as Structure);

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Duplicate")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });

  it("an admin can goBack, publish, delete and update a structure even if the stamp is not correct", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [
          { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL },
        ],
      },
    ]);

    await renderControls({ id: "1" } as Structure);

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Duplicate");
    screen.getByText("Delete");
    screen.getByText("Update");
  });
});
