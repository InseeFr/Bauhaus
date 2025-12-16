import { render } from "@testing-library/react";

import { NoteVisualization } from "./";

describe("note-visualization", () => {
  it("renders without crashing", () => {
    render(<NoteVisualization params={[]} secondLang={false} />);
  });
});
