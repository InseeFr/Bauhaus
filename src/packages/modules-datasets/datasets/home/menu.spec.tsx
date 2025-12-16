import { render, screen } from "@testing-library/react";

import { RBACMock } from "../../../tests/rbac";
import { mockReactQueryForRbac } from "../../../tests/render";

describe("Distributions Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new dataset if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DATASET",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <RBACMock>
        <HomePageMenu />
      </RBACMock>,
    );

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a dataset", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DATASET",
        privileges: [{ privilege: "CREATE", strategy: "NONE" }],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <RBACMock>
        <HomePageMenu />
      </RBACMock>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
