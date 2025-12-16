import { render } from "@testing-library/react";

import ConceptsSummary from "./";

describe("dashboard-concepts-summary", () => {
  it("renders without crashing", () => {
    render(<ConceptsSummary conceptsData={[]} />);
  });
});
