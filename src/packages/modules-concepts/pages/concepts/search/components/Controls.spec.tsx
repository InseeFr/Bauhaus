import { render } from "@testing-library/react";

import Controls from "./Controls";

describe("concepts-advanced-search-controls", () => {
  it("renders without crashing", () => {
    render(
      <Controls
        onClickReturn={vi.fn()}
        initializeState={vi.fn()}
        onExport={vi.fn()}
        conceptsList={[]}
      />,
    );
  });
});
