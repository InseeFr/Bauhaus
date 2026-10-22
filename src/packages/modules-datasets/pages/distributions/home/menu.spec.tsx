import { screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { PrivilegeGrant, renderMenuWithPrivileges } from "../../menu.testing";

const renderHomePageMenu = (grants: PrivilegeGrant[]) =>
  renderMenuWithPrivileges(MODULES.DATASET_DISTRIBUTION, grants, async () => {
    const { HomePageMenu } = await import("./menu");
    return <HomePageMenu />;
  });

describe("Distributions Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new distribution if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role", async () => {
    await renderHomePageMenu([[PRIVILEGES.CREATE, STRATEGIES.ALL]]);

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a distribution", async () => {
    await renderHomePageMenu([]);

    expect(screen.queryByText("New")).toBeNull();
  });
});
