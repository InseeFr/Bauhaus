import { renderWithRouter } from "../../../../../tests/render";
import Members from "./Members";

const members = [{ id: "1", labelLg1: "Member 1" }];

describe("classification-family-members", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Members members={members} secondLang={true} />);
  });
});
