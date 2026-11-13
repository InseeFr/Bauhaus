import { cleanup, screen } from "@testing-library/react";

import { Series } from "@model/operations/series";

import { MODULES, Privilege, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { rbacFor, renderWithRbac } from "../../menu-rbac.testing";

const renderMenu = (rbac: Privilege[], series: object = { creators: [] }) =>
  renderWithRbac(
    rbac,
    () => import("./menu"),
    ({ Menu }) => <Menu series={series as unknown as Series} onPublish={vi.fn()} />,
  );

describe("Family Home Page Menu", () => {
  afterEach(() => {
    cleanup();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("can See Create the report", async () => {
    await renderMenu([
      rbacFor(MODULES.OPERATION_SERIES, [PRIVILEGES.CREATE, PRIVILEGES.READ]),
      rbacFor(MODULES.OPERATION_SIMS, [PRIVILEGES.CREATE, PRIVILEGES.READ]),
    ]);

    screen.getByText("Back");
    expect(screen.queryByText("Show the report")).toBeNull();
    screen.getByText("Create the report");
  }, 10000);

  it("can See Show the report", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_SERIES, [PRIVILEGES.CREATE, PRIVILEGES.READ])], {
      creators: [],
      idSims: "1",
    });

    screen.getByText("Back");
    screen.getByText("Show the report");
    expect(screen.queryByText("Create the report")).toBeNull();
  });

  it("can see the Publish button", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_SERIES, [PRIVILEGES.PUBLISH])]);

    screen.getByText("Publish");
  });

  it("can see the Update", async () => {
    await renderMenu([rbacFor(MODULES.OPERATION_SERIES, [PRIVILEGES.UPDATE])]);

    screen.getByText("Update");
  });
});
