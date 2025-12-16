import { render, screen } from "@testing-library/react";

import { RBACMock } from "../tests/rbac";
import { mockReactQueryForRbac } from "../tests/render";

describe("Concepts Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new concept", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_CONCEPT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <RBACMock>
        <Menu />
      </RBACMock>,
    );

    screen.getByText("New");
  });

  it("a user without Admin role cannot create a concept", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_CONCEPT",
        privileges: [],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <RBACMock>
        <Menu />
      </RBACMock>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
