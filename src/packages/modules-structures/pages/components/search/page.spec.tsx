import {
  creatorAndValidationStateCases,
  itBehavesAsAnAdvancedSearchPage,
  ORGANIZATION_IRI,
  OTHER_ORGANIZATION_IRI,
} from "../../search.testing";
import { Component } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@sdk/index", async () =>
  (await import("../../../mocks.testing")).searchPageApi("getMutualizedComponentsForSearch"),
);

vi.mock("@components/business/creators-input", () => import("../../creators-input.testing"));

const data = [
  {
    id: "c1000",
    labelLg1: "test",
    type: "ATTRIBUTE",
    concept: "c1",
    creator: ORGANIZATION_IRI,
    validationState: "Unpublished",
  },
  {
    id: "c1001",
    labelLg1: "another",
    type: "MEASURE",
    concept: "c2",
    creator: OTHER_ORGANIZATION_IRI,
    validationState: "Validated",
  },
  {
    id: "c1002",
    labelLg1: "third",
    type: "DIMENSION",
    concept: "c1",
    creator: ORGANIZATION_IRI,
    validationState: "Modified",
  },
];

describe("<SearchFormList /> component-search", () => {
  itBehavesAsAnAdvancedSearchPage({
    Component,
    formSelector: ".component-search-form",
    searchMethod: "getMutualizedComponentsForSearch",
    data,
    cases: [
      { name: "returns all data when the form is empty", form: {}, expected: 3 },
      { name: "filters by label", form: { labelLg1: "test" }, expected: 1 },
      ...creatorAndValidationStateCases,
    ],
  });
});
