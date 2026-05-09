import { Collection } from "../../../../../model/concepts/collection";
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
        general={empty() as unknown as Collection}
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
