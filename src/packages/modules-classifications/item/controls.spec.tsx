import { render } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../tests/render";

describe("classification-item-controls", () => {
  it("renders without crashing", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.CONCEPT_CONCEPT,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { default: Controls } = await import("./controls");
    render(
      <WithRouter>
        <Controls classificationId="nafr2" itemId="A" version={1} />
      </WithRouter>,
    );
  });
});
