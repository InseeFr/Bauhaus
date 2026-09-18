import { screen } from "@testing-library/react";

import { Family } from "@model/operations/family";

import { MODULES, PRIVILEGE, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../menu-rbac.testing";

const renderMenu = (privileges: PRIVILEGE[]) =>
  renderWithRbac(
    [rbacFor(MODULES.OPERATION_FAMILY, privileges)],
    () => import("./menu"),
    ({ Menu }) => <Menu family={{} as Family} publish={vi.fn()} />,
  );

describe("Family Home Page Menu", () => {
  afterEach(resetRbacMocks);
  it("an admin can update and publish a family", async () => {
    await renderMenu([PRIVILEGES.UPDATE, PRIVILEGES.PUBLISH]);

    screen.getByText("Update");
    screen.getByText("Publish");
    screen.getByText("Back");
  });

  it("a user without Admin cannot create or publish a family", async () => {
    await renderMenu([]);

    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
    screen.getByText("Back");
  });
});
