import { render, screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Distributions Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new distribution if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.DATASET_DISTRIBUTION,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <WithRouter>
        <HomePageMenu />
      </WithRouter>,
    );

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a distribution", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.DATASET_DISTRIBUTION,
        privileges: [],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <WithRouter>
        <HomePageMenu />
      </WithRouter>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
