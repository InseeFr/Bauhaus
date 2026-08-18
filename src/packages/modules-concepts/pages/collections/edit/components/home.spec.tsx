import { renderWithRouterAndQuery } from "../../../../../tests/render";
import { emptyCollectionGeneral } from "../../../../utils/emptyCollectionGeneral";
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
        general={emptyCollectionGeneral()}
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
