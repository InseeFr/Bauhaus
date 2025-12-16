import { render } from "@testing-library/react";

import { RBACMock } from "../../tests/rbac";
import { mockReactQueryForRbac } from "../../tests/render";

describe("classification-item-controls", () => {
  it("renders without crashing", async () => {
    mockReactQueryForRbac([
      {
        application: "CONCEPT_CONCEPT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { default: Controls } = await import("./controls");
    render(
      <RBACMock>
        <Controls classificationId="nafr2" itemId="A" version={1} />
      </RBACMock>,
    );
  });
});
