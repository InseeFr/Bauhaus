import { renderWithRouter } from "../../../tests/render";
import ControlsLayout from "./controls-layout";

describe("concept-edition-creation-controls-layout", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <ControlsLayout
        message="message"
        saveEnabled={false}
        conceptsWithLinks={[]}
        handleSave={vi.fn()}
        redirectCancel={vi.fn()}
      />,
    );
  });
});
