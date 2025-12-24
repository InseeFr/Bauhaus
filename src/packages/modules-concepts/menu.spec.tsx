import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../tests/render";

describe("Concepts Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new concept", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.CONCEPT_CONCEPT,
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

  it("a user without Admin role cannot create a concept", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.CONCEPT_CONCEPT,
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
