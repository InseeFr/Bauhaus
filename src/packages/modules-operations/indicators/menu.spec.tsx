import { render, screen } from "@testing-library/react";

import { RBACMock } from "../../tests/rbac";
import { mockReactQueryForRbac } from "../../tests/render";

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

  it("a user without Admin cannot create or publish a family", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_INDICATOR",
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
