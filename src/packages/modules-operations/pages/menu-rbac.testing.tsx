import { screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { MODULES, Privilege, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { rbacFor } from "../../tests/rbac.testing";

export { importWithRbac, rbacFor, renderWithRbac, resetRbacMocks } from "../../tests/rbac.testing";

type RenderMenu = (rbac: Privilege[], entity?: object) => Promise<unknown>;

/**
 * Boutons du rapport SIMS communs aux menus de ses parents (opération, indicateur) :
 * « voir » s'il existe, « créer » sinon, selon les droits.
 */
export const itHandlesSimsReportButtons = ({
  renderMenu,
  ownRights,
  withSims,
  rightsWhenSimsDefined,
}: {
  renderMenu: RenderMenu;
  ownRights: Privilege[];
  withSims: object;
  rightsWhenSimsDefined: Privilege[];
}) => {
  it("can see the Sims View button if exists", async () => {
    await renderMenu(ownRights, withSims);

    screen.getByText("Show the report");
  });
  it("can not see the Sims View button if undefined", async () => {
    await renderMenu(ownRights);

    expect(screen.queryByText("Show the report")).toBeNull();
  });
  it("can see the Sims Create button if undefined", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_SIMS, [PRIVILEGES.CREATE])]);

    screen.getByText("Create the report");
  });
  it("can not see the Sims View button if defined", async () => {
    await renderMenu(rightsWhenSimsDefined, withSims);

    expect(screen.queryByText("Create the report")).toBeNull();
  });
};
