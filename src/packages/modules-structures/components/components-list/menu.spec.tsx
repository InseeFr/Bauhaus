import { render, screen } from "@testing-library/react";

import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Components Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("an admin can create a new component if he does not have the Gestionnaire_structures_RMESGNCS role", async () => {
    mockReactQueryForRbac([
      {
        application: "STRUCTURE_COMPONENT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <WithRouter>
        <HomePageMenu filter="" />
      </WithRouter>,
    );

    screen.getByText("New");
  });

  it("a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a component", async () => {
    mockReactQueryForRbac([
      {
        application: "STRUCTURE_COMPONENT",
        privileges: [],
      },
    ]);

    const { HomePageMenu } = await import("./menu");

    render(
      <WithRouter>
        <HomePageMenu filter="" />
      </WithRouter>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
