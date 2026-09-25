import { screen } from "@testing-library/react";

import { Indicator } from "@model/operations/indicator";

import { MODULES, Privilege, PRIVILEGES } from "@utils/hooks/rbac-constants";

import {
  itHandlesSimsReportButtons,
  rbacFor,
  renderWithRbac,
  resetRbacMocks,
} from "../../menu-rbac.testing";

const renderMenu = (rbac: Privilege[], indicator: object = { creators: [] }) =>
  renderWithRbac(
    rbac,
    () => import("./menu"),
    ({ Menu }) => <Menu indicator={indicator as unknown as Indicator} publish={vi.fn()} />,
  );

describe("Family Home Page Menu", () => {
  afterEach(resetRbacMocks);

  it("can see the Back button", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_INDICATOR)]);

    screen.getByText("Back");
  }, 10000);

  itHandlesSimsReportButtons({
    renderMenu,
    ownRights: [rbacFor(MODULES.OPERATION_INDICATOR)],
    withSims: { creators: [], idSims: "1" },
    rightsWhenSimsDefined: [rbacFor(MODULES.OPERATION_INDICATOR)],
  });

  it("can see the Publish button", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_INDICATOR, [PRIVILEGES.PUBLISH])]);

    screen.getByText("Publish");
  });

  it("can see the Update", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_INDICATOR, [PRIVILEGES.UPDATE])]);

    screen.getByText("Update");
  });
});
