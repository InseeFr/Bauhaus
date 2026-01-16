import { renderWithRouter } from "../../tests/render";
import Narrowers from "./narrowers";

const narrowers = [{ id: "1", label: "Narrower 1" }];

describe("classification-item-narrowers", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Narrowers narrowers={narrowers} classificationId="id" secondLang={true} />);
  });
});
