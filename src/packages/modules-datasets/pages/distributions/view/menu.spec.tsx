import { Dataset, Distribution } from "@model/Dataset";
import { UNPUBLISHED, VALIDATED } from "@model/ValidationState";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { itShowsMenuActions, menuCase, renderMenuWithPrivileges } from "../../menu.testing";

const cases = [
  menuCase({
    name: "a user can only see the go back button",
    hidden: ["Publish", "Delete", "Update"],
  }),
  menuCase({
    name: "an admin can goBack, publish, delete and update a distribution even if the stamp is not correct",
    grants: [
      [PRIVILEGES.UPDATE, STRATEGIES.ALL],
      [PRIVILEGES.PUBLISH, STRATEGIES.ALL],
      [PRIVILEGES.DELETE, STRATEGIES.ALL],
    ],
    visible: ["Back", "Publish", "Delete", "Update"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a distribution if the stamp is correct and validationState is unpublished",
    grants: [
      [PRIVILEGES.UPDATE, STRATEGIES.ALL],
      [PRIVILEGES.PUBLISH, STRATEGIES.ALL],
      [PRIVILEGES.DELETE, STRATEGIES.ALL],
    ],
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: UNPUBLISHED, catalogRecord: { contributor: ["INSEE"] } },
    visible: ["Back", "Publish", "Delete", "Update"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish and update a distribution if the stamp is correct and validationState is published",
    grants: [
      [PRIVILEGES.UPDATE, STRATEGIES.ALL],
      [PRIVILEGES.PUBLISH, STRATEGIES.ALL],
      [PRIVILEGES.DELETE, STRATEGIES.STAMP],
    ],
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: VALIDATED, catalogRecord: { contributor: ["INSEE"] } },
    visible: ["Back", "Publish", "Update"],
    hidden: ["Delete"],
  }),
  menuCase({
    name: "an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct",
    grants: [
      [PRIVILEGES.UPDATE, STRATEGIES.STAMP],
      [PRIVILEGES.PUBLISH, STRATEGIES.STAMP],
      [PRIVILEGES.DELETE, STRATEGIES.STAMP],
    ],
    stamps: [{ stamp: "INSEE" }],
    dataset: { validationState: "Published", catalogRecord: { contributor: ["XXXXXX"] } },
    hidden: ["Publish", "Delete", "Update"],
  }),
];

describe("Distribution View Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  itShowsMenuActions(cases, ({ grants, stamps, dataset }) =>
    renderMenuWithPrivileges(
      MODULES.DATASET_DISTRIBUTION,
      grants,
      async () => {
        const { ViewMenu } = await import("./menu");
        return (
          <ViewMenu
            dataset={dataset as Dataset}
            distribution={{} as Distribution}
            onPublish={vi.fn()}
            onDelete={vi.fn()}
          ></ViewMenu>
        );
      },
      stamps,
    ),
  );
});
