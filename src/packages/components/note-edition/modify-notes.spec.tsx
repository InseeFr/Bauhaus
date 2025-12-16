import { render } from "@testing-library/react";

import ModifyNotes from "./modify-notes";

describe("modify-notes", () => {
  it("renders without crashing", () => {
    render(<ModifyNotes handleChange={vi.fn()} note="note" />);
  });
});
