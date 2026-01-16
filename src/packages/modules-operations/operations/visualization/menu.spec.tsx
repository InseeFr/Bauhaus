import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { Operation } from "../../../model/Operation";
import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Family Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("can see the Back button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_OPERATION,
        privileges: [],
      },
    ]);
    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] } } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    screen.getByText("Back");
  });

  it("can see the Sims View button if exists", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_OPERATION,
        privileges: [],
      },
    ]);
    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] }, idSims: "1" } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    screen.getByText("Show the report");
  });
  it("can not see the Sims View button if undefined", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_OPERATION,
        privileges: [],
      },
    ]);
    const { Menu } = await import("./menu");
    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] } } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.queryByText("Show the report")).toBeNull();
  });
  it("can see the Sims Create button if undefined", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SIMS,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);
    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] } } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    screen.getByText("Create the report");
  });
  it("can not see the Sims View button if defined", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_SIMS,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);
    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] }, idSims: "1" } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    expect(screen.queryByText("Create the report")).toBeNull();
  });

  it("can see the Publish button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_OPERATION,
        privileges: [{ privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL }],
      },
    ]);
    const { Menu } = await import("./menu");
    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] } } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    screen.getByText("Publish");
  });

  it("can see the Update", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_OPERATION,
        privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL }],
      },
    ]);
    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu
          operation={{ series: { creators: [] } } as unknown as Operation}
          onPublish={vi.fn()}
        />
      </WithRouter>,
    );

    screen.getByText("Update");
  });
});
