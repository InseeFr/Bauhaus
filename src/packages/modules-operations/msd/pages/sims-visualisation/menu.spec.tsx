import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { Sims } from "../../../../model/Sims";
import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

describe("Sims Visualisation Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  describe("As an SERIES_CONTRIBUTOR", () => {
    it("can see the Back button", async () => {
      mockReactQueryForRbac([
        {
          application: MODULES.OPERATION_SIMS,
          privileges: [
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL },
          ],
        },
      ]);

      const { Menu } = await import("./menu");

      render(
        <WithRouter>
          <Menu
            sims={{ series: { creators: [] } } as unknown as Sims}
            onPublish={vi.fn()}
            onExport={vi.fn()}
            onDelete={vi.fn()}
            owners={[]}
          />
        </WithRouter>,
      );

      screen.getByText("Back");
      screen.getByText("Publish");
      screen.getByText("Update");
      screen.getByText("Export");
    });

    it("can not see the Sims View button if defined with good stamp but no siblings", async () => {
      mockReactQueryForRbac([
        {
          application: MODULES.OPERATION_SIMS,
          privileges: [],
        },
      ]);

      const { Menu } = await import("./menu");

      render(
        <WithRouter>
          <Menu
            sims={{} as unknown as Sims}
            onPublish={vi.fn()}
            onExport={vi.fn()}
            onDelete={vi.fn()}
            owners={["stamp"]}
          />
        </WithRouter>,
      );

      expect(screen.queryByText("Publish")).toBeNull();
      expect(screen.queryByText("Update")).toBeNull();
    });
  });
});
