import { cleanup, render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { Series } from "../../../model/operations/series";
import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Family Home Page Menu", () => {
  afterEach(() => {
    cleanup();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("can See Create the report", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SERIES,
        privileges: [
          { privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL },
        ],
      },
      {
        application: MODULES.OPERATION_SIMS,
        privileges: [
          { privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL },
        ],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu series={{ creators: [] } as unknown as Series} onPublish={vi.fn()} />
      </WithRouter>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Show the report")).toBeNull();
    screen.getByText("Create the report");
  }, 10000);

  it("can See Show the report", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SERIES,
        privileges: [
          { privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL },
        ],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu series={{ creators: [], idSims: "1" } as unknown as Series} onPublish={vi.fn()} />
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Show the report");
    expect(screen.queryByText("Create the report")).toBeNull();
  });

  it("can see the Publish button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SERIES,
        privileges: [{ privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu series={{ creators: [] } as unknown as Series} onPublish={vi.fn()} />
      </WithRouter>,
    );

    screen.getByText("Publish");
  });

  it("can see the Update", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SERIES,
        privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu series={{ creators: [] } as unknown as Series} onPublish={vi.fn()} />
      </WithRouter>,
    );

    screen.getByText("Update");
  });
});
