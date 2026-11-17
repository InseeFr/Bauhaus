import { screen } from "@testing-library/react";

import { Dataset } from "@model/Dataset";
import { UNPUBLISHED } from "@model/ValidationState";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import {
  itShowsMenuActions,
  menuCase,
  PrivilegeGrant,
  renderMenuWithPrivileges,
} from "../../menu.testing";

const renderViewMenu = (
  grants: PrivilegeGrant[],
  dataset: Partial<Dataset>,
  stamps?: { stamp: string }[],
) =>
  renderMenuWithPrivileges(
    MODULES.DATASET_DATASET,
    grants,
    async () => {
      const { ViewMenu } = await import("./menu");
      return (
        <ViewMenu dataset={dataset as Dataset} onPublish={vi.fn()} onDelete={vi.fn()}></ViewMenu>
      );
    },
    stamps,
  );

const allWithStamp: PrivilegeGrant[] = [
  [PRIVILEGES.UPDATE, STRATEGIES.STAMP],
  [PRIVILEGES.DELETE, STRATEGIES.STAMP],
  [PRIVILEGES.PUBLISH, STRATEGIES.STAMP],
];

const cases = [
  menuCase({
    name: "a user can only see the go back button",
    hidden: ["Publish", "Delete", "Update", "Duplicate"],
  }),
  menuCase({
    name: "an admin can goBack, publish, delete and update a dataset even if the stamp is not correct",
    grants: [
      [PRIVILEGES.UPDATE, STRATEGIES.ALL],
      [PRIVILEGES.DELETE, STRATEGIES.ALL],
      [PRIVILEGES.PUBLISH, STRATEGIES.ALL],
    ],
    visible: ["Back", "Publish", "Delete", "Update"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a dataset if the stamp is correct and validationState is unpublished",
    grants: allWithStamp,
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: UNPUBLISHED, catalogRecord: { contributor: "INSEE" } },
    visible: ["Back", "Publish", "Delete", "Update"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish  and update a dataset if the stamp is correct and validationState is unpublished",
    grants: allWithStamp,
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: "Published", catalogRecord: { contributor: ["INSEE"] } },
    visible: ["Back", "Publish", "Update"],
    hidden: ["Delete"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct",
    grants: allWithStamp,
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: "Published", catalogRecord: { contributor: ["XXXXXX"] } },
    hidden: ["Publish", "Delete", "Update", "Duplicate"],
  }),
];

describe("Dataset View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  itShowsMenuActions(cases, ({ grants, stamps, dataset }) =>
    renderViewMenu(grants, dataset as Partial<Dataset>, stamps),
  );

  it("a user with the CREATE privilege can duplicate a dataset", async () => {
    await renderViewMenu([[PRIVILEGES.CREATE, STRATEGIES.ALL]], { id: "jd1000" });

    expect(screen.getByText("Duplicate").closest("a")).toHaveAttribute(
      "href",
      "/datasets/jd1000/duplicate",
    );
  });
});
