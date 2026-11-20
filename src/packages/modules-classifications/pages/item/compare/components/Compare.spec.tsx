import { screen } from "@testing-library/react";

import { renderWithAppContext } from "../../../../../tests/render";
import { Compare } from "./Compare";

const GENERAL = {
  prefLabelLg1: "prefLabelLg1",
  validationState: "Validated",
  conceptVersion: "2",
};
const NOTES = {
  1: { version: 1, definitionLg1: "Définition v1" },
  2: { version: 2, definitionLg1: "Définition v2" },
};

describe("classification item compare", () => {
  it("compare les versions des notes du poste", () => {
    renderWithAppContext(
      <Compare
        classificationId="classificationId"
        general={GENERAL}
        notes={NOTES}
        secondLang={false}
      />,
    );

    const definition = screen.getByRole("region", { name: "General note" });
    expect(definition).toHaveTextContent("Définition v1");
    expect(definition).toHaveTextContent("Définition v2");
  });
});
