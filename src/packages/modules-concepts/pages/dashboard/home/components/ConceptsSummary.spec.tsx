import { render } from "@testing-library/react";

import ConceptsSummary from "./ConceptsSummary";

describe("dashboard-concepts-summary", () => {
  it("renders without crashing", () => {
    render(<ConceptsSummary conceptsData={[]} />);
  });
});
