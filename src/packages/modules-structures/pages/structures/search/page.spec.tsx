import {
  creatorAndValidationStateCases,
  itBehavesAsAnAdvancedSearchPage,
  ORGANIZATION_IRI,
  OTHER_ORGANIZATION_IRI,
} from "../../search.testing";
import { Component } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@sdk/index", async () =>
  (await import("../../../mocks.testing")).searchPageApi("getStructuresForSearch"),
);

vi.mock("@components/business/creators-input", () => import("../../creators-input.testing"));

const data = [
  {
    id: "dsd1000",
    labelLg1: "test",
    creator: ORGANIZATION_IRI,
    components: [],
    validationState: "Unpublished",
  },
  {
    id: "dsd1001",
    labelLg1: "another",
    creator: OTHER_ORGANIZATION_IRI,
    components: [{ labelLg1: "foo", type: "ATTRIBUTE", concept: "c1" }],
    validationState: "Validated",
  },
  {
    id: "dsd1002",
    labelLg1: "third",
    creator: ORGANIZATION_IRI,
    components: [{ labelLg1: "bar", type: "MEASURE", concept: "c2" }],
    validationState: "Modified",
  },
];

describe("<SearchFormList /> structure-search", () => {
  itBehavesAsAnAdvancedSearchPage({
    Component,
    formSelector: ".structure-search-form",
    searchMethod: "getStructuresForSearch",
    data,
    cases: [
      {
        name: "returns all data when the form is empty (including structures with no components)",
        form: {},
        expected: 3,
      },
      { name: "filters by labelLg1", form: { labelLg1: "test" }, expected: 1 },
      ...creatorAndValidationStateCases,
      { name: "filters by component label", form: { componentLabelLg1: "foo" }, expected: 1 },
      { name: "filters by component type", form: { type: "MEASURE" }, expected: 1 },
    ],
  });
});
