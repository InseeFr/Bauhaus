import { screen } from "@testing-library/react";

import { MODULES, PRIVILEGE, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../menu-rbac.testing";

const renderMenu = (privileges: PRIVILEGE[]) =>
  renderWithRbac(
    [rbacFor(MODULES.OPERATION_DOCUMENT, privileges)],
    () => import("./menu"),
    ({ Menu }) => <Menu />,
  );

describe("Document Home Page Menu", () => {
  afterEach(resetRbacMocks);

  it("an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role", async () => {
    await renderMenu([PRIVILEGES.CREATE]);

    screen.getByText("New Link");
    screen.getByText("New Document");
  });

  it("a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document", async () => {
    await renderMenu([]);

    expect(screen.queryByText("New Link")).toBeNull();
    expect(screen.queryByText("New Document")).toBeNull();
  });
});
