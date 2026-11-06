import { render } from "@testing-library/react";

import { locales } from "../../../../../tests/default-values";
import { ClassificationNotes as ItemNotesVisualization } from "./ClassificationNotes";

const NO_NOTES = {};

describe("classification-visualization-notes", () => {
  it("renders without crashing", () => {
    render(<ItemNotesVisualization notes={NO_NOTES} langs={locales} secondLang={true} />);
  });
});
