import { screen } from "@testing-library/react";

import { MODULES, Privilege, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../../../tests/rbac.testing";

const renderMenu = (rbac: Privilege[]) =>
  renderWithRbac(
    rbac,
    () => import("./menu"),
    ({ Menu }) => <Menu />,
  );

describe("Concepts Home Page Menu", () => {
  afterEach(resetRbacMocks);

  it("an admin can create a new concept", async () => {
    await renderMenu([rbacFor(MODULES.CONCEPT_CONCEPT, [PRIVILEGES.CREATE])]);

    screen.getByText("New");
  });

  it("a user without Admin role cannot create a concept", async () => {
    await renderMenu([rbacFor(MODULES.CONCEPT_CONCEPT)]);

    expect(screen.queryByText("New")).toBeNull();
  });
});
