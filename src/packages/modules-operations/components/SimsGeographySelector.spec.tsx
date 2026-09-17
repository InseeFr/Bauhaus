import { render } from "@testing-library/react";

import { SimsGeographySelector, Geography } from "./SimsGeographySelector";

const renderSelector = ({
  includes = [],
  excludes = [],
}: {
  includes?: Geography[];
  excludes?: Geography[];
} = {}) =>
  render(
    <SimsGeographySelector
      includes={includes}
      excludes={excludes}
      onRemoveExclude={vi.fn()}
      onRemoveInclude={vi.fn()}
    />,
  );

describe("<SimsGeographySelector />", () => {
  it("should display a list with included zones", () => {
    const includes = [{ label: "labelLg1", labelLg2: "labelLg2", value: "1" } as Geography];
    const { container } = renderSelector({ includes });
    expect(container.querySelectorAll(".row div:nth-child(1) li")).toHaveLength(1);
  });
  it("should display a list with excludd zones", () => {
    const excludes = [{ label: "labelLg1", labelLg2: "labelLg2", value: "1" } as Geography];
    const { container } = renderSelector({ excludes });
    expect(container.querySelectorAll(".row div:nth-child(2) li")).toHaveLength(1);
  });
  it("should not display a list if no included zones were provided", () => {
    const { container } = renderSelector();
    expect(container.querySelector(".row div:nth-child(1) ul")).toBeNull();
  });
  it("should not display a list if no excluded zones were provided", () => {
    const { container } = renderSelector();
    expect(container.querySelector(".row div:nth-child(2) ul")).toBeNull();
  });
  it("should display delete button if readOnly=false", () => {
    const includes = [{ label: "labelLg1", labelLg2: "labelLg2", value: "1" } as Geography];
    const excludes = [{ label: "labelLg1", labelLg2: "labelLg2", value: "1" } as Geography];
    const { container } = renderSelector({ includes, excludes });
    expect(container.querySelectorAll("button")).toHaveLength(2);
  });
});
