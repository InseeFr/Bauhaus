import { locales } from "../../../tests/default-values";
import { renderWithRouter } from "../../../tests/render";
import { empty } from "../utils/general";
import Collection from "./home";

vi.mock("./general", () => {
  return {
    default: () => <></>,
  };
});

describe("collection-edition-creation", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <Collection
        title=""
        general={empty()}
        members={[]}
        collectionList={[]}
        conceptList={[]}
        save={vi.fn()}
        langs={locales}
      />,
    );
  });
});
