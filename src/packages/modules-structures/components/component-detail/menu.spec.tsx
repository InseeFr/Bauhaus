import { render, screen } from "@testing-library/react";

import { Component } from "@model/structures/Component";
import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Component View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("a user can only see the go back button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [],
      },
    ]);
    const { ViewMenu } = await import("./menu");

    const component = { id: "1" } as unknown as Component;
    render(
      <WithRouter>
        <ViewMenu
          component={component}
          updatable={true}
          publish={vi.fn()}
          handleUpdate={vi.fn()}
          handleDelete={vi.fn()}
          handleBack={vi.fn}
        ></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });

  it("an admin can goBack, publish, delete and update a component even if the stamp is not correct", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_COMPONENT,
        privileges: [
          { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");
    const component = { id: "1" } as unknown as Component;

    render(
      <WithRouter>
        <ViewMenu
          component={component}
          updatable={true}
          publish={vi.fn()}
          handleUpdate={vi.fn()}
          handleDelete={vi.fn()}
          handleBack={vi.fn}
        ></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_ structures_RMESGNCS can goBack, publish and update a component if the stamp is correct and validationState is published", async () => {
    mockReactQueryForRbac(
      [
        {
          application: MODULES.STRUCTURE_COMPONENT,
          privileges: [
            { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL },
          ],
        },
      ],
      [{ stamp: "INSEE" }],
    );

    const { ViewMenu } = await import("./menu");

    const component = {
      id: "1",
      contributor: "INSEE",
      validationState: "published",
    } as unknown as Component;

    render(
      <WithRouter>
        <ViewMenu
          component={component}
          updatable={true}
          publish={vi.fn()}
          handleUpdate={vi.fn()}
          handleDelete={vi.fn()}
          handleBack={vi.fn}
        ></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    expect(screen.queryByText("Delete")).toBeNull();
    screen.getByText("Update");
  });
});
