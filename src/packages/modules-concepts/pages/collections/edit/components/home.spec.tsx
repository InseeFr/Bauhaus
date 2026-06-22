import { renderWithRouterAndQuery } from "../../../../../tests/render";
import { empty } from "../../../../utils/collection-general";
import Collection_ from "./home";

vi.mock("./general", () => {
  return {
    default: () => <></>,
  };
});

vi.mock("./members", () => {
  return {
    default: () => <></>,
  };
});

describe("collection-edition-creation", () => {
  it("renders without crashing", () => {
    renderWithRouterAndQuery(
      <Collection_
        title=""
        general={empty()}
        members={[]}
        collectionList={[]}
        conceptList={[]}
        save={vi.fn()}
        submitting={false}
        setSubmitting={vi.fn()}
      />,
    );
  });
});
