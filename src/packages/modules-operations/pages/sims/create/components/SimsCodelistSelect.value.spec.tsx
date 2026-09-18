import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { lastSelectProps, selectSpy } from "./selectRmesStub.testing";
import { SimsCodelistSelect } from "./SimsCodelistSelect";

vi.mock("@components/select-rmes", () => import("./selectRmesStub.testing"));

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
];

describe("SimsCodelistSelect - value normalization (multi)", () => {
  // Boucle plutôt que it.each : les titres interpolés sont tronqués par Vitest.
  for (const { name, value, expected } of [
    {
      name: "passes an empty array when currentSection.value is undefined",
      value: undefined,
      expected: [],
    },
    { name: "passes an empty array when currentSection.value is null", value: null, expected: [] },
    {
      name: "passes an empty array when currentSection.value is an empty string",
      value: "",
      expected: [],
    },
    {
      name: "wraps a defined non-array value into an array",
      value: "option1",
      expected: ["option1"],
    },
    {
      name: "keeps an array value untouched",
      value: ["option1", "option2"],
      expected: ["option1", "option2"],
    },
  ]) {
    it(name, () => {
      selectSpy.mockClear();
      render(
        <SimsCodelistSelect
          multi
          currentSection={{ value }}
          options={options}
          onChange={vi.fn()}
        />,
      );
      expect(lastSelectProps()?.value).toEqual(expected);
    });
  }
});
