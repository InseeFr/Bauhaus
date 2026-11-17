import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../../tests/render";

const renderHomePageMenu = async () => {
  const { HomePageMenu } = await import("./menu");

  render(
    <WithRouter>
      <HomePageMenu />
    </WithRouter>,
  );
};

const renderDumbHomePageMenu = async (isLocal: boolean) => {
  mockReactQueryForRbac([]);

  const { DumbHomePageMenu } = await import("./menu");

  render(
    <WithRouter>
      <DumbHomePageMenu isLocal={isLocal} />
    </WithRouter>,
  );
};

describe("Structures Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    await renderHomePageMenu();

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a structure", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [],
      },
    ]);

    await renderHomePageMenu();

    expect(screen.queryByText("New")).toBeNull();
  });

  it("should not return import button if isLocal is falsy", async () => {
    await renderDumbHomePageMenu(false);

    expect(screen.queryByText("Import")).toBeNull();
  });

  it("should add import button if isLocal is true", async () => {
    await renderDumbHomePageMenu(true);

    screen.getByText("Import");
  });

  it("should not return export button if isLocal is falsy", async () => {
    await renderDumbHomePageMenu(false);

    expect(screen.queryByText("Export")).toBeNull();
  });

  it("should add export button if isLocal is true", async () => {
    await renderDumbHomePageMenu(true);

    screen.getByText("Export");
  });
});
