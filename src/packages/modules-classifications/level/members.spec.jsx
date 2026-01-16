import { renderWithRouter } from "../../tests/render";
import Members from "./members";

const members = [{ id: "1", label: "Member 1" }];

describe("classification-level-members", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Members members={members} classificationId="id" secondLang={true} />);
  });
});
