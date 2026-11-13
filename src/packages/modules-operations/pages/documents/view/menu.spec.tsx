import { screen } from "@testing-library/react";

import { Document } from "@model/operations/document";

import { MODULES, PRIVILEGE, PRIVILEGES, STRATEGIES, STRATEGY } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../menu-rbac.testing";

const renderMenu = (
  privileges: PRIVILEGE[],
  strategy: STRATEGY,
  document: Document,
  stamps?: { stamp: string }[],
) =>
  renderWithRbac(
    [rbacFor(MODULES.OPERATION_DOCUMENT, privileges, strategy)],
    () => import("./menu"),
    ({ Menu }) => <Menu document={document} type="type" />,
    stamps,
  );

const documentCreatedBy = (stamp: string) =>
  ({ id: "1", sims: [{ creators: [stamp] }] }) as Document;

describe("Document Visualization Page Menu", () => {
  afterEach(resetRbacMocks);
  it("an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role", async () => {
    await renderMenu([PRIVILEGES.UPDATE], STRATEGIES.ALL, {} as Document);

    screen.getByText("Update");
  });

  it("a user with INDICATOR_CONTRIBUTOR role can update a document if the stamp match", async () => {
    await renderMenu([PRIVILEGES.UPDATE], STRATEGIES.STAMP, documentCreatedBy("stamp"), [
      { stamp: "stamp" },
    ]);

    screen.getByText("Update");
  });

  it("a user with INDICATOR_CONTRIBUTOR role cannot update a document if the stamp does not match", async () => {
    await renderMenu([PRIVILEGES.UPDATE], STRATEGIES.STAMP, documentCreatedBy("fake"), [
      { stamp: "other-stamp" },
    ]);

    expect(screen.queryByText("Update")).toBeNull();
  });

  it("a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document", async () => {
    await renderMenu([], STRATEGIES.ALL, {} as Document);

    expect(screen.queryByText("Update")).toBeNull();
  });
});
