import { render } from "@testing-library/react";

import { locales } from "../../../../../tests/default-values";
import { ClassificationNotes as ItemNotesVisualization } from "./ClassificationNotes";

describe("classification-visualization-notes", () => {
  it("renders without crashing", () => {
    render(<ItemNotesVisualization notes={{}} langs={locales} secondLang={true} />);
  });
});
