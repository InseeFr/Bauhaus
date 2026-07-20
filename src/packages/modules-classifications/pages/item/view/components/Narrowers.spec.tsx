import { renderWithRouter } from "../../../../../tests/render";
import Narrowers from "./Narrowers";

const narrowers = [{ id: "1", labelLg1: "Narrower 1" }];

describe("classification-item-narrowers", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Narrowers narrowers={narrowers} classificationId="id" secondLang={true} />);
  });
});
