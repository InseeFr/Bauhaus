import { render, screen } from "@testing-library/react";

import { Document } from "../../../model/operations/document";
import { RBACMock } from "../../../tests/rbac";
import { mockReactQueryForRbac } from "../../../tests/render";

describe("Document Visualization Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "UPDATE", strategy: "ALL" }],
      },
    ]);

    const { Menu } = await import("./Menu");

    render(
      <RBACMock>
        <Menu document={{} as Document} type="type" />
      </RBACMock>,
    );

    screen.getByText("Update");
  });

  it("a user with INDICATOR_CONTRIBUTOR role can update a document if the stamp match", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "UPDATE", strategy: "STAMP" }],
      },
    ]);

    const { Menu } = await import("./Menu");

    render(
      <RBACMock stamp="stamp">
        <Menu
          document={
            {
              id: "1",
              sims: [{ creators: ["stamp"] }],
            } as Document
          }
          type="type"
        />
      </RBACMock>,
    );

    screen.getByText("Update");
  });

  it("a user with INDICATOR_CONTRIBUTOR role cannot update a document if the stamp does not match", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "UPDATE", strategy: "STAMP" }],
      },
    ]);

    const { Menu } = await import("./Menu");

    render(
      <RBACMock>
        <Menu
          document={
            {
              id: "1",
              sims: [{ creators: ["fake"] }],
            } as Document
          }
          type="type"
        />
      </RBACMock>,
    );

    expect(screen.queryByText("Update")).toBeNull();
  });

  it("a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [],
      },
    ]);

    const { Menu } = await import("./Menu");

    render(
      <RBACMock>
        <Menu document={{} as Document} type="type" />
      </RBACMock>,
    );

    expect(screen.queryByText("Update")).toBeNull();
  });
});
