import { render } from "@testing-library/react";

import { empty } from "../../../utils/general";
import ConceptGeneral from "./general";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("@utils/hooks/useLocales", () => ({
  useLocales: () => ({ lg1: "fr", lg2: "en" }),
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <></>,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <></>,
}));
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => <></>,
}));

describe("concept-edition-creation-general", () => {
  it("renders without crashing", () => {
    render(<ConceptGeneral general={empty()} stampList={[]} handleChange={vi.fn()} />);
  });
});
