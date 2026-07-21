import { renderWithAppContext } from "../../../../tests/render";
import * as associationUtils from "../../../utils/empty";
import Home from "./home";

describe("association-home", () => {
  it("renders without crashing", () => {
    renderWithAppContext(<Home association={associationUtils.empty()} secondLang={false} />);
  });
});
