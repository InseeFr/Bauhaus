import { locales } from "../../../../tests/default-values";
import { renderWithRouterAndQuery } from "../../../../tests/render";
import { empty } from "../../../collections/utils/general";
import Collection from "./home";

vi.mock("./components/general", () => {
  return {
    default: () => <></>,
  };
});

vi.mock("./components/members", () => {
  return {
    default: () => <></>,
  };
});

describe("collection-edition-creation", () => {
  it("renders without crashing", () => {
    renderWithRouterAndQuery(
      <Collection
        title=""
        general={empty()}
        members={[]}
        collectionList={[]}
        conceptList={[]}
        save={vi.fn()}
        langs={locales}
        setSubmitting={vi.fn()}
      />,
    );
  });
});
