import { render } from "@testing-library/react";
import { ComponentProps } from "react";

import { SimsBlockCodelist } from "./SimsBlockCodelist";

const codelists = {
  1: {
    codes: [
      { code: "c1", labelLg1: "labelLg1 1" },
      { code: "c2", labelLg1: "labelLg1 2" },
      { code: "c3", labelLg1: "labelLg1 3" },
      { code: "c4", labelLg1: "labelLg1 4" },
    ],
  },
};

const renderBlock = (
  value: string | string[],
  props: Partial<ComponentProps<typeof SimsBlockCodelist>> = {},
) =>
  render(
    <SimsBlockCodelist
      codelists={codelists}
      currentSection={{ codeList: "1", value }}
      isSecondLang={false}
      {...props}
    />,
  );

describe("<SimsBlockCodelist />", () => {
  it("should not display a list if the maxOccurs property is not unbounded", () => {
    const { container } = renderBlock("c1");

    expect(container.innerHTML).toBe("labelLg1 1");
  });
  it("should not display a list if the maxOccurs property is unbounded and the value is not an array", () => {
    const { container } = renderBlock("c1", { multi: true });
    expect(container.querySelector("li")).toBeNull();
  });
  it("should display a list if the maxOccurs property is unbounded and the value is an array", () => {
    const { container } = renderBlock(["c1", "c2"], { multi: true });
    expect(container.querySelector("li:nth-child(1)")?.innerHTML).toBe("labelLg1 1");
    expect(container.querySelector("li:nth-child(2)")?.innerHTML).toBe("labelLg1 2");
  });
});
