import { renderWithAppContext } from "../../../tests/render";
import ClassificationItems from "./home";

describe("classification-items-home", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      <ClassificationItems items={[]} classificationId="id" secondLang={false} />,
    );
  });
});
