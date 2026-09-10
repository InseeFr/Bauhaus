import { renderWithRouter } from "../../../../../tests/render";
import { emptyCollectionGeneral } from "../../../../utils/emptyCollectionGeneral";
import { CollectionGeneralEdition as CollectionGeneral } from "./CollectionGeneralEdition";

vi.mock("@components/form/input", () => ({ TextInput: () => <></> }));
vi.mock("@components/errors-bloc", () => ({ ClientSideError: () => <></> }));
vi.mock("@components/input-rmes", () => ({
  InputRmes: ({ label }: { label: string }) => <div data-testid="input-rmes">{label}</div>,
}));
vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <></>,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <></>,
}));
vi.mock("@components/required-icon", () => ({ RequiredIcon: () => <></> }));

describe("collection-edition-creation-general", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <CollectionGeneral
        general={emptyCollectionGeneral()}
        handleChange={vi.fn()}
        errors={{ errorMessage: [], fields: {} }}
      />,
    );
  });

  it("shows the identifier input in creation mode", () => {
    const { queryAllByTestId } = renderWithRouter(
      <CollectionGeneral
        general={emptyCollectionGeneral()}
        handleChange={vi.fn()}
        errors={{ errorMessage: [], fields: {} }}
        creation
      />,
    );
    const labels = queryAllByTestId("input-rmes").map((node) => node.textContent);
    expect(labels).toContain("Identifier");
  });

  it("hides the identifier input in edition mode", () => {
    const { queryAllByTestId } = renderWithRouter(
      <CollectionGeneral
        general={emptyCollectionGeneral()}
        handleChange={vi.fn()}
        errors={{ errorMessage: [], fields: {} }}
        creation={false}
      />,
    );
    const labels = queryAllByTestId("input-rmes").map((node) => node.textContent);
    expect(labels).not.toContain("Identifier");
  });
});
