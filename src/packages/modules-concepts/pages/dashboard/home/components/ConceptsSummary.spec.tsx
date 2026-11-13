import { render } from "@testing-library/react";

import { ConceptsSummary } from "./ConceptsSummary";

const NO_CONCEPTS: never[] = [];

describe("dashboard-concepts-summary", () => {
  it("renders without crashing", () => {
    render(<ConceptsSummary conceptsData={NO_CONCEPTS} />);
  });
});
