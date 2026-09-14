import { render } from "@testing-library/react";

import { SimsBlockCodelist } from "./SimsBlockCodelist";

describe("<SimsBlockCodelist />", () => {
  it("should not display a list if the maxOccurs property is not unbounded", () => {
    const { container } = render(
      <SimsBlockCodelist
        codelists={{
          1: {
            codes: [
              { code: "c1", labelLg1: "labelLg1 1" },
              { code: "c2", labelLg1: "labelLg1 2" },
              { code: "c3", labelLg1: "labelLg1 3" },
              { code: "c4", labelLg1: "labelLg1 4" },
            ],
          },
        }}
        currentSection={{
          codeList: "1",
          value: "c1",
        }}
        isSecondLang={false}
      />,
    );

    expect(container.innerHTML).toBe("labelLg1 1");
  });
  it("should not display a list if the maxOccurs property is unbounded and the value is not an array", () => {
    const { container } = render(
      <SimsBlockCodelist
        codelists={{
          1: {
            codes: [
              { code: "c1", labelLg1: "labelLg1 1" },
              { code: "c2", labelLg1: "labelLg1 2" },
              { code: "c3", labelLg1: "labelLg1 3" },
              { code: "c4", labelLg1: "labelLg1 4" },
            ],
          },
        }}
        currentSection={{
          codeList: "1",
          value: "c1",
        }}
        multi={true}
        isSecondLang={false}
      />,
    );
    expect(container.querySelector("li")).toBeNull();
  });
  it("should display a list if the maxOccurs property is unbounded and the value is an array", () => {
    const { container } = render(
      <SimsBlockCodelist
        codelists={{
          1: {
            codes: [
              { code: "c1", labelLg1: "labelLg1 1" },
              { code: "c2", labelLg1: "labelLg1 2" },
              { code: "c3", labelLg1: "labelLg1 3" },
              { code: "c4", labelLg1: "labelLg1 4" },
            ],
          },
        }}
        currentSection={{
          codeList: "1",
          value: ["c1", "c2"],
        }}
        multi={true}
        isSecondLang={false}
      />,
    );
    expect(container.querySelector("li:nth-child(1)")?.innerHTML).toBe("labelLg1 1");
    expect(container.querySelector("li:nth-child(2)")?.innerHTML).toBe("labelLg1 2");
  });
});
