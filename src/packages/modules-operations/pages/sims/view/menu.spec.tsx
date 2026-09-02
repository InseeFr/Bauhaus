import { render, screen } from "@testing-library/react";

import { Sims } from "@model/Sims";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

describe("Sims Visualization Menu", () => {
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
            { privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL },
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

    it("hides the Export button when the user has no READ privilege on OPERATION_SIMS", async () => {
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
            owners={[]}
          />
        </WithRouter>,
      );

      expect(screen.queryByText("Export")).toBeNull();
    });

    it("displays Update and Publish when user HIE stamp matches a short-form owner stamp", async () => {
      mockReactQueryForRbac(
        [
          {
            application: MODULES.OPERATION_SIMS,
            privileges: [
              { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.STAMP },
              { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP },
            ],
          },
        ],
        [{ stamp: "HIE2000069" }],
      );

      const { Menu } = await import("./menu");

      render(
        <WithRouter>
          <Menu
            sims={{ idSeries: "s1" } as unknown as Sims}
            onPublish={vi.fn()}
            onExport={vi.fn()}
            onDelete={vi.fn()}
            owners={["HIE2000069"]}
          />
        </WithRouter>,
      );

      screen.getByText("Update");
      screen.getByText("Publish");
    });
  });
});
