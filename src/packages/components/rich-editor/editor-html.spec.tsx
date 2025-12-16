import { render } from "@testing-library/react";

import { EditorHTML } from ".";

describe("editor-html", () => {
  it("renders without crashing", () => {
    const onChange = () => "";
    render(<EditorHTML text="text" handleChange={onChange} smart={true} />);
  });
});
