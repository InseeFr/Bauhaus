import { render } from "@testing-library/react";

import { NoteVisualization } from "./";

const NO_PARAMS: never[] = [];

describe("note-visualization", () => {
  it("renders without crashing", () => {
    render(<NoteVisualization params={NO_PARAMS} secondLang={false} />);
  });
});
