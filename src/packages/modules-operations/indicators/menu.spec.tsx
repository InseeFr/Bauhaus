import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../tests/render";

describe("Indicators Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("an admin can update and publish a family", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_INDICATOR,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);
    const { Menu } = await import("./menu");
    render(
      <WithRouter>
        <Menu />
      </WithRouter>,
    );

    screen.getByText("New");
  });

  it("a user without Admin cannot create or publish a family", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_INDICATOR,
        privileges: [],
      },
    ]);
    const { Menu } = await import("./menu");
    render(
      <WithRouter>
        <Menu />
      </WithRouter>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
