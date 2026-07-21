import { render } from "@testing-library/react";

import { General } from "./General";

const general = {};

describe("classification-series-general", () => {
  it("renders without crashing", () => {
    render(<General general={general} secondLang={false} />);
  });
});
