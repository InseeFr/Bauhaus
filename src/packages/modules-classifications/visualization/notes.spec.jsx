import { render } from "@testing-library/react";

import { locales } from "../../tests/default-values";
import Notes from "./notes";

const notes = {};

describe("classification-notes", () => {
  it("renders without crashing", () => {
    render(<Notes notes={notes} secondLang={false} langs={locales} />);
  });
});
