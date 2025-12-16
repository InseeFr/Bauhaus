import { render, screen } from "@testing-library/react";

import { Dataset, Distribution } from "../../../model/Dataset";
import { UNPUBLISHED, VALIDATED } from "../../../model/ValidationState";
import { RBACMock } from "../../../tests/rbac";
import { mockReactQueryForRbac } from "../../../tests/render";

describe("Distribution View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("a user can only see the go back button", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DISTRIBUTION",
        privileges: [],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {} as Dataset;
    const distribution = {} as Distribution;
    render(
      <RBACMock>
        <ViewMenu
          dataset={dataset}
          distribution={distribution}
          onPublish={vi.fn()}
          onDelete={vi.fn()}
        ></ViewMenu>
      </RBACMock>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });

  it("an admin can goBack, publish, delete and update a distribution even if the stamp is not correct", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DISTRIBUTION",
        privileges: [
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "PUBLISH", strategy: "ALL" },
          { privilege: "DELETE", strategy: "ALL" },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");
    const dataset = {} as Dataset;
    const distribution = {} as Distribution;

    render(
      <RBACMock>
        <ViewMenu
          dataset={dataset}
          distribution={distribution}
          onPublish={vi.fn()}
          onDelete={vi.fn()}
        ></ViewMenu>
      </RBACMock>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a distribution if the stamp is correct and validationState is unpublished", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DISTRIBUTION",
        privileges: [
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "PUBLISH", strategy: "ALL" },
          { privilege: "DELETE", strategy: "ALL" },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: UNPUBLISHED,
      catalogRecord: { contributor: ["INSEE"] },
    } as unknown as Dataset;
    const distribution = {} as Distribution;

    render(
      <RBACMock stamp="INSEE">
        <ViewMenu
          dataset={dataset}
          distribution={distribution}
          onPublish={vi.fn()}
          onDelete={vi.fn()}
        ></ViewMenu>
      </RBACMock>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish and update a distribution if the stamp is correct and validationState is published", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DISTRIBUTION",
        privileges: [
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "PUBLISH", strategy: "ALL" },
          { privilege: "DELETE", strategy: "STAMP" },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: VALIDATED,
      catalogRecord: { contributor: ["INSEE"] },
    } as unknown as Dataset;
    const distribution = {} as Distribution;

    render(
      <RBACMock stamp="INSEE">
        <ViewMenu
          dataset={dataset}
          distribution={distribution}
          onPublish={vi.fn()}
          onDelete={vi.fn()}
        ></ViewMenu>
      </RBACMock>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    expect(screen.queryByText("Delete")).toBeNull();
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct", async () => {
    mockReactQueryForRbac([
      {
        application: "DATASET_DISTRIBUTION",
        privileges: [
          { privilege: "UPDATE", strategy: "STAMP" },
          { privilege: "PUBLISH", strategy: "STAMP" },
          { privilege: "DELETE", strategy: "STAMP" },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: "Published",
      catalogRecord: { contributor: ["XXXXXX"] },
    } as unknown as Dataset;
    const distribution = {} as Distribution;

    render(
      <RBACMock stamp="INSEE">
        <ViewMenu
          dataset={dataset}
          distribution={distribution}
          onPublish={vi.fn()}
          onDelete={vi.fn()}
        ></ViewMenu>
      </RBACMock>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });
});
