import { render } from "@testing-library/react";

import { SimsGeographyI18NLabel } from "./SimsGeographyI18NLabel";
import { Geography } from "./SimsGeographySelector";

describe("<SimsGeographyI18NLabel />", () => {
  it("should render labels for both langs", () => {
    const geography = {
      label: "labelLg1",
      labelLg2: "labelLg2",
      typeTerritory: "typeTerritory",
    } as Geography;
    const { container } = render(<SimsGeographyI18NLabel geography={geography} />);
    expect(container.innerHTML).toBe("labelLg1 <i>(labelLg2 typeTerritory)</i>");
  });
});
