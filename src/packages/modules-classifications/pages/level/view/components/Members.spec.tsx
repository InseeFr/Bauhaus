import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
import { renderWithRouter } from "../../../../../tests/render";
import { Members } from "./Members";

const members = [{ id: "1", labelLg1: "Member 1" }];

describe("classification-level-members", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Members members={members} classificationId="id" secondLang={true} />);
  });

  it("met les membres en page sans classe Bootstrap", () => {
    renderWithRouter(<Members members={members} classificationId="id" secondLang={true} />);
    expectNoBootstrapClass();
  });
});
