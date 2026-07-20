import { render } from "@testing-library/react";

import General from "./General";

const general = {};

describe("classification-level-general", () => {
  it("renders without crashing", () => {
    render(<General general={general} classificationId="id" secondLang={false} />);
  });
});
