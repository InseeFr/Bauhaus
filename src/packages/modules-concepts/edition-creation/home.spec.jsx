import { locales } from "../../tests/default-values";
import { renderWithRouter } from "../../tests/render";
import { empty } from "../utils/general";
import ConceptEditionCreation, { onGeneralInformationChange } from "./home";

vi.mock("./general");

describe("concept-edition-creation", () => {
  it("should update general informations", () => {
    expect(
      onGeneralInformationChange(
        {
          state1: "state1",
          data: {
            data1: "data1",
            general: {
              general1: "general1",
              general2: "general2",
            },
          },
        },
        {
          general2: "general21",
          general3: "general3",
        },
      ),
    ).toEqual({
      state1: "state1",
      data: {
        data1: "data1",
        general: {
          general1: "general1",
          general2: "general21",
          general3: "general3",
        },
      },
    });
  });
  it("renders without crashing", () => {
    renderWithRouter(
      <ConceptEditionCreation
        id="id"
        creation={true}
        title="title"
        general={empty()}
        notes={{}}
        conceptsWithLinks={[]}
        stampList={[]}
        save={vi.fn()}
        langs={locales}
      />,
    );
  });
});
