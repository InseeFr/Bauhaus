import { screen } from "@testing-library/react";

import { Operation } from "@model/Operation";

import { MODULES, Privilege, PRIVILEGES } from "@utils/hooks/rbac-constants";

import {
  itHandlesSimsReportButtons,
  rbacFor,
  renderWithRbac,
  resetRbacMocks,
} from "../../menu-rbac.testing";

const renderMenu = (rbac: Privilege[], operation: object = { series: { creators: [] } }) =>
  renderWithRbac(
    rbac,
    () => import("./menu"),
    ({ Menu }) => <Menu operation={operation as unknown as Operation} onPublish={vi.fn()} />,
  );

describe("Family Home Page Menu", () => {
  afterEach(resetRbacMocks);

  it("can see the Back button", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_OPERATION)]);

    screen.getByText("Back");
  });

  itHandlesSimsReportButtons({
    renderMenu,
    ownRights: [rbacFor(MODULES.OPERATION_OPERATION)],
    withSims: { series: { creators: [] }, idSims: "1" },
    rightsWhenSimsDefined: [rbacFor(MODULES.OPERATION_SIMS, [PRIVILEGES.CREATE])],
  });

  it("can see the Publish button", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_OPERATION, [PRIVILEGES.PUBLISH])]);

    screen.getByText("Publish");
  });

  it("can see the Update", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_OPERATION, [PRIVILEGES.UPDATE])]);

    screen.getByText("Update");
  });
});
