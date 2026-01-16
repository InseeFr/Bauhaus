import { render } from "@testing-library/react";

import Controls from "./controls";

describe("concepts-advanced-search-controls", () => {
  it("renders without crashing", () => {
    render(<Controls onClickReturn={vi.fn()} initializeState={vi.fn()} conceptsList={[]} />);
  });
});
