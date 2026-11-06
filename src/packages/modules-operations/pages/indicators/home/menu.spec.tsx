import { screen } from "@testing-library/react";

import { MODULES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../../../tests/rbac.testing";

describe("Family Home Page Menu", () => {
  afterEach(resetRbacMocks);

  it("a user without Admin cannot create or publish a family", async () => {
    await renderWithRbac(
      [rbacFor(MODULES.OPERATION_INDICATOR)],
      () => import("./menu"),
      ({ Menu }) => <Menu />,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
