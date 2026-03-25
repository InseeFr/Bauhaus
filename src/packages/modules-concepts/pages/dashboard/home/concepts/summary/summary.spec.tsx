import { render } from "@testing-library/react";

import ConceptsSummary from "./summary";

describe("dashboard-concepts-summary", () => {
  it("renders without crashing", () => {
    render(<ConceptsSummary conceptsData={[]} />);
  });
});
