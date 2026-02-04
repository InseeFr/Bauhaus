import { render, screen } from "@testing-library/react";

import { UNPUBLISHED } from "@model/ValidationState";
import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { Dataset } from "../../../model/Dataset";
import { mockReactQueryForRbac, WithRouter } from "../../../tests/render";

describe("Dataset View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("a user can only see the go back button", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.DATASET_DATASET,
        privileges: [],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {} as unknown as Dataset;
    render(
      <WithRouter>
        <ViewMenu dataset={dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });

  it("an admin can goBack, publish, delete and update a dataset even if the stamp is not correct", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.DATASET_DATASET,
        privileges: [
          { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
        ],
      },
    ]);

    const { ViewMenu } = await import("./menu");

    const dataset = {} as unknown as Dataset;
    render(
      <WithRouter>
        <ViewMenu dataset={dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a dataset if the stamp is correct and validationState is unpublished", async () => {
    mockReactQueryForRbac(
      [
        {
          application: MODULES.DATASET_DATASET,
          privileges: [
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.STAMP },
          ],
        },
      ],
      [{ stamp: "INSEE" }],
    );

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: UNPUBLISHED,
      catalogRecord: { contributor: "INSEE" },
    } as unknown as Dataset;
    render(
      <WithRouter>
        <ViewMenu dataset={dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish  and update a dataset if the stamp is correct and validationState is unpublished", async () => {
    mockReactQueryForRbac(
      [
        {
          application: MODULES.DATASET_DATASET,
          privileges: [
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.STAMP },
          ],
        },
      ],
      [{ stamp: "INSEE" }],
    );

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: "Published",
      catalogRecord: { contributor: ["INSEE"] },
    } as unknown as Dataset;
    render(
      <WithRouter>
        <ViewMenu dataset={dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    expect(screen.queryByText("Delete")).toBeNull();
    screen.getByText("Update");
  });

  it("an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct", async () => {
    mockReactQueryForRbac(
      [
        {
          application: MODULES.DATASET_DATASET,
          privileges: [
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.STAMP },
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.STAMP },
          ],
        },
      ],
      [{ stamp: "INSEE" }],
    );

    const { ViewMenu } = await import("./menu");

    const dataset = {
      validationState: "Published",
      catalogRecord: { contributor: ["XXXXXX"] },
    } as unknown as Dataset;
    render(
      <WithRouter>
        <ViewMenu dataset={dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      </WithRouter>,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });
});
