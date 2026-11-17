import { screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { PrivilegeGrant, renderMenuWithPrivileges } from "../../menu.testing";

const renderHomePageMenu = (grants: PrivilegeGrant[]) =>
  renderMenuWithPrivileges(MODULES.DATASET_DATASET, grants, async () => {
    const { HomePageMenu } = await import("./menu");
    return <HomePageMenu />;
  });

describe("Datasets Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new dataset if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role", async () => {
    await renderHomePageMenu([[PRIVILEGES.CREATE, STRATEGIES.ALL]]);

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a dataset", async () => {
    await renderHomePageMenu([[PRIVILEGES.CREATE, STRATEGIES.NONE]]);

    expect(screen.queryByText("New")).toBeNull();
  });
});
