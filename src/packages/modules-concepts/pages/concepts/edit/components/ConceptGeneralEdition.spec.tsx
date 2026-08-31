import { render } from "@testing-library/react";

import { ConceptGeneral as ConceptGeneralType } from "../../../../../model/concepts/concept";
import { emptyConceptGeneral } from "../../../../utils/emptyConceptGeneral";
import { ConceptGeneralEdition as ConceptGeneral } from "./ConceptGeneralEdition";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@utils/hooks/useLocales", () => ({
  useLocales: () => ({ lg1: "fr", lg2: "en" }),
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <></>,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <></>,
}));
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => <></>,
}));

vi.mock("../../../../hooks/useCollections", () => ({
  useCollections: () => ({ data: [] }),
}));

describe("concept-edition-creation-general", () => {
  it("renders without crashing", () => {
    render(
      <ConceptGeneral
        general={emptyConceptGeneral() as unknown as ConceptGeneralType}
        stampList={[]}
        handleChange={vi.fn()}
      />,
    );
  });
});
