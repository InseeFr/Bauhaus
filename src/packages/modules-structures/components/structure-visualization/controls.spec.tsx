import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { StructureApi } from "@sdk/index";
import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { UNPUBLISHED } from "../../../model/ValidationState";
import { Structure } from "../../../model/structures/Structure";
import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

vi.mock("@sdk/index", () => ({
  StructureApi: {
    deleteStructure: vi.fn(),
  },
}));

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

    const { default: Controls } = await import("./controls");

    const structure = {
      id: "1",
      contributor: "someStamp",
      validationState: UNPUBLISHED,
    } as Structure;

    StructureApi.deleteStructure.mockReturnValue(Promise.resolve());

    render(
      <WithRouter>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </WithRouter>,
    );

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

    const { default: Controls } = await import("./controls");

    const structure = { id: "1" } as Structure;
    render(
      <WithRouter>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </WithRouter>,
    );

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

    const { default: Controls } = await import("./controls");

    const structure = { id: "1" } as Structure;

    render(
      <WithRouter>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Duplicate");
    screen.getByText("Delete");
    screen.getByText("Update");
  });
});
