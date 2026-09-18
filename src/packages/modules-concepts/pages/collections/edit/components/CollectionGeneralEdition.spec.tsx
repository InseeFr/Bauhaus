import { renderWithRouter } from "../../../../../tests/render";
import { emptyCollectionGeneral } from "../../../../utils/emptyCollectionGeneral";
import { CollectionGeneralEdition as CollectionGeneral } from "./CollectionGeneralEdition";

vi.mock("@components/form/input", () => ({ TextInput: () => <></> }));
vi.mock("@components/errors-bloc", () => ({ ClientSideError: () => <></> }));
vi.mock("@components/input-rmes", () => ({
  InputRmes: ({ label }: { label: string }) => <div data-testid="input-rmes">{label}</div>,
}));
vi.mock(
  "@components/business/creators-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock(
  "@components/business/contributors-input/contributors-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock("@components/required-icon", () => ({ RequiredIcon: () => <></> }));

const renderGeneral = (creation?: boolean) =>
  renderWithRouter(
    <CollectionGeneral
      general={emptyCollectionGeneral()}
      handleChange={vi.fn()}
      errors={{ errorMessage: [], fields: {} }}
      creation={creation}
    />,
  );

const inputLabels = (queryAllByTestId: (id: string) => HTMLElement[]) =>
  queryAllByTestId("input-rmes").map((node) => node.textContent);

describe("collection-edition-creation-general", () => {
  it("renders without crashing", () => {
    renderGeneral();
  });

  it("shows the identifier input in creation mode", () => {
    const { queryAllByTestId } = renderGeneral(true);
    expect(inputLabels(queryAllByTestId)).toContain("Identifier");
  });

  it("hides the identifier input in edition mode", () => {
    const { queryAllByTestId } = renderGeneral(false);
    expect(inputLabels(queryAllByTestId)).not.toContain("Identifier");
  });
});
