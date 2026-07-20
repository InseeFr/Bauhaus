import { render } from "@testing-library/react";

import { locales } from "../../../../../tests/default-values";
import ItemNotesVisualization from "./Notes";

describe("classification-visualization-notes", () => {
  it("renders without crashing", () => {
    render(<ItemNotesVisualization notes={{}} langs={locales} secondLang={true} />);
  });
});
