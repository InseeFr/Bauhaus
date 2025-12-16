import { render } from "@testing-library/react";

import { locales } from "../../../tests/default-values";
import General from "./general";

const general = {};

describe("classification-series-general", () => {
  it("renders without crashing", () => {
    render(<General general={general} secondLang={false} langs={locales} />);
  });
});
