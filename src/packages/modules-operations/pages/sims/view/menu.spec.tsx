import { screen } from "@testing-library/react";

import { Sims } from "@model/Sims";

import { MODULES, PRIVILEGES, STRATEGIES, UserStamp } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac, resetRbacMocks } from "../../menu-rbac.testing";

const renderMenu = (
  rbac: Parameters<typeof rbacFor>,
  sims: object,
  owners: string[],
  stamps?: UserStamp[],
) =>
  renderWithRbac(
    [rbacFor(...rbac)],
    () => import("./menu"),
    ({ Menu }) => (
      <Menu
        sims={sims as unknown as Sims}
        onPublish={vi.fn()}
        onExport={vi.fn()}
        onDelete={vi.fn()}
        owners={owners}
      />
    ),
    stamps,
  );

describe("Sims Visualization Menu", () => {
  afterEach(resetRbacMocks);
  describe("As an SERIES_CONTRIBUTOR", () => {
    it("can see the Back button", async () => {
      await renderMenu(
        [MODULES.OPERATION_SIMS, [PRIVILEGES.PUBLISH, PRIVILEGES.UPDATE, PRIVILEGES.READ]],
        { series: { creators: [] } },
        [],
      );

      screen.getByText("Back");
      screen.getByText("Publish");
      screen.getByText("Update");
      screen.getByText("Export");
    });

    it("can not see the Sims View button if defined with good stamp but no siblings", async () => {
      await renderMenu([MODULES.OPERATION_SIMS], {}, ["stamp"]);

      expect(screen.queryByText("Publish")).toBeNull();
      expect(screen.queryByText("Update")).toBeNull();
    });

    it("hides the Export button when the user has no READ privilege on OPERATION_SIMS", async () => {
      await renderMenu([MODULES.OPERATION_SIMS], {}, []);

      expect(screen.queryByText("Export")).toBeNull();
    });

    it("displays Update and Publish when user HIE stamp matches a short-form owner stamp", async () => {
      await renderMenu(
        [MODULES.OPERATION_SIMS, [PRIVILEGES.PUBLISH, PRIVILEGES.UPDATE], STRATEGIES.STAMP],
        { idSeries: "s1" },
        ["HIE2000069"],
        [{ stamp: "HIE2000069" }],
      );

      screen.getByText("Update");
      screen.getByText("Publish");
    });
  });
});
