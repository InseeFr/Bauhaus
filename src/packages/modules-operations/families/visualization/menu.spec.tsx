import { render, screen } from "@testing-library/react";

import { Family } from "../../../model/operations/family";
import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Family Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("an admin can update and publish a family", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_FAMILY",
        privileges: [
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "PUBLISH", strategy: "ALL" },
        ],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu family={{} as Family} publish={vi.fn()} />
      </WithRouter>,
    );

    screen.getByText("Update");
    screen.getByText("Publish");
    screen.getByText("Back");
  });

  it("a user without Admin cannot create or publish a family", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_FAMILY",
        privileges: [],
      },
    ]);

    const { Menu } = await import("./menu");

    render(
      <WithRouter>
        <Menu family={{} as Family} publish={vi.fn()} />
      </WithRouter>,
    );

    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Publish")).toBeNull();
    screen.getByText("Back");
  });
});
