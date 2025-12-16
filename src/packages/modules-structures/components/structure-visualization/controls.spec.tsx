import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { StructureApi } from "@sdk/index";

import { UNPUBLISHED } from "../../../model/ValidationState";
import { Structure } from "../../../model/structures/Structure";
import { RBACMock } from "../../../tests/rbac";
import { mockReactQueryForRbac } from "../../../tests/render";

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
        application: "STRUCTURE_STRUCTURE",
        privileges: [{ privilege: "DELETE", strategy: "ALL" }],
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
      <RBACMock>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </RBACMock>,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(StructureApi.deleteStructure).toHaveBeenCalledWith("1");
  });

  it("a user can only see the go back button", async () => {
    mockReactQueryForRbac([
      {
        application: "STRUCTURE_STRUCTURE",
        privileges: [],
      },
    ]);

    const { default: Controls } = await import("./controls");

    const structure = { id: "1" } as Structure;
    render(
      <RBACMock>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </RBACMock>,
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
        application: "STRUCTURE_STRUCTURE",
        privileges: [
          { privilege: "PUBLISH", strategy: "ALL" },
          { privilege: "CREATE", strategy: "ALL" },
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "DELETE", strategy: "ALL" },
        ],
      },
    ]);

    const { default: Controls } = await import("./controls");

    const structure = { id: "1" } as Structure;

    render(
      <RBACMock>
        <Controls structure={structure} publish={vi.fn()}></Controls>
      </RBACMock>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Duplicate");
    screen.getByText("Delete");
    screen.getByText("Update");
  });
});
