import { render, screen } from "@testing-library/react";

import { MODULES } from "@utils/hooks/rbac-constants";
import {mockReactQueryForRbac, WithRouter} from "../../tests/render";

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
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
