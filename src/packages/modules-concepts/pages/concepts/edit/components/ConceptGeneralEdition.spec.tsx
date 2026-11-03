import { render, screen } from "@testing-library/react";

import { ConceptGeneral as ConceptGeneralType } from "@model/concepts/concept";

import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
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

vi.mock(
  "@components/business/creators-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock(
  "@components/business/contributors-input/contributors-input",
  () => import("../../../../testing/form-stubs.testing"),
);
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
        handleChange={vi.fn()}
      />,
    );
  });

  it("ne pose aucune classe Bootstrap", () => {
    render(
      <ConceptGeneral
        general={emptyConceptGeneral() as unknown as ConceptGeneralType}
        handleChange={vi.fn()}
      />,
    );
    expectNoBootstrapClass();
  });

  it("préfixe l'adresse du complément d'information sans le groupe de champs de Bootstrap", () => {
    const { container } = render(
      <ConceptGeneral
        general={emptyConceptGeneral() as unknown as ConceptGeneralType}
        handleChange={vi.fn()}
      />,
    );
    expect(container.querySelector('[class*="input-group"]')).toBeNull();
    expect(screen.getByText("http://")).toBeInTheDocument();
  });
});
