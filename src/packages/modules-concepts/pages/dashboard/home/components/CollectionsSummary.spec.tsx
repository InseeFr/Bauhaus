import { render } from "@testing-library/react";

import { CollectionsSummary } from "./CollectionsSummary";

const NO_COLLECTIONS: never[] = [];

describe("dashboard-collections-summary", () => {
  it("renders without crashing", () => {
    render(<CollectionsSummary collectionsData={NO_COLLECTIONS} />);
  });
});
