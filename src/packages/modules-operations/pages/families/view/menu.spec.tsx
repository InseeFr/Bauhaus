import { screen } from "@testing-library/react";

import { Family } from "@model/operations/family";

import { MODULES, PRIVILEGE, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../menu-rbac.testing";

const EMPTY_FAMILY = {} as Family;
const CONTRIBUTED_FAMILY = {
  contributor: ["http://bauhaus/organisations/insee/DG75-L201"],
} as Family;

const renderMenu = (privileges: PRIVILEGE[]) =>
  renderWithRbac(
    [rbacFor(MODULES.OPERATION_FAMILY, privileges)],
    () => import("./menu"),
    ({ Menu }) => <Menu family={EMPTY_FAMILY} publish={vi.fn()} />,
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

  describe("with the STAMP strategy", () => {
    const renderStampMenu = (stamp: string) =>
      renderWithRbac(
        [
          rbacFor(
            MODULES.OPERATION_FAMILY,
            [PRIVILEGES.UPDATE, PRIVILEGES.PUBLISH],
            STRATEGIES.STAMP,
          ),
        ],
        () => import("./menu"),
        ({ Menu }) => <Menu family={CONTRIBUTED_FAMILY} publish={vi.fn()} />,
        [{ stamp }],
      );

    it("a contributor of the family can update and publish it", async () => {
      await renderStampMenu("DG75-L201");

      screen.getByText("Update");
      screen.getByText("Publish");
    });

    it("another stamp cannot update nor publish the family", async () => {
      await renderStampMenu("DG75-H250");

      expect(screen.queryByText("Update")).toBeNull();
      expect(screen.queryByText("Publish")).toBeNull();
    });
  });
});
