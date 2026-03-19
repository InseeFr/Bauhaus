import { render } from "@testing-library/react";

import CollectionsSummary from "./summary";

describe("dashboard-collections-summary", () => {
  it("renders without crashing", () => {
    render(<CollectionsSummary collectionsData={[]} />);
  });
});
