import { renderWithAppContext } from "../../../../../tests/render";
import { Compare } from "./Compare";

describe("concepts-compare", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      <Compare
        classificationId="classificationId"
        itemId="itemId"
        general={{
          prefLabelLg1: "prefLabelLg1",
          validationState: "Validated",
          conceptVersion: "2",
        }}
        notes={{ 1: {}, 2: {} }}
        secondLang={false}
      />,
    );
  });
});
