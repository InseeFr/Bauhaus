import { renderWithAppContext } from "../../../../../tests/render";
import { Compare } from "./Compare";

const GENERAL = {
  prefLabelLg1: "prefLabelLg1",
  validationState: "Validated",
  conceptVersion: "2",
};
const NOTES = { 1: {}, 2: {} };

describe("concepts-compare", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      <Compare
        classificationId="classificationId"
        itemId="itemId"
        general={GENERAL}
        notes={NOTES}
        secondLang={false}
      />,
    );
  });
});
