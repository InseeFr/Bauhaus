import { renderWithAppContext } from "../../../../../tests/render";
import * as associationUtils from "../../../../utils/empty";
import { AssociationHome } from "./AssociationHome";

describe("association-home", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      <AssociationHome association={associationUtils.empty()} secondLang={false} />,
    );
  });
});
