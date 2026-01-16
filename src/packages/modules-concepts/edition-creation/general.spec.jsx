import { render } from "@testing-library/react";

import { empty } from "../utils/general";
import ConceptGeneral from "./general";

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <></>,
}));
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => <></>,
}));

describe("concept-edition-creation-general", () => {
  it("renders without crashing", () => {
    render(<ConceptGeneral general={empty()} stampList={[]} handleChange={vi.fn()} />);
  });
});
