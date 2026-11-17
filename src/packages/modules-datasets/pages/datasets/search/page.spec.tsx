import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Route, Routes } from "react-router";

import { renderWithRouter } from "../../../../tests/render";
import { AdvancedSearchForm, FieldsForDatasetsAdvancedSearch, SearchDataset } from "./page";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: true,
    data: ["data"],
  }),
}));

let lastCreatorsInputProps: Record<string, unknown> | undefined;

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: (props: Record<string, unknown>) => {
    lastCreatorsInputProps = props;
    return <div data-testid="creators-input" />;
  },
}));

const NO_DATASETS: SearchDataset[] = [];
const NO_OPTIONS: never[] = [];

const renderSearchForm = (data: SearchDataset[] = NO_DATASETS, initialEntries?: string[]) =>
  renderWithRouter(
    <AdvancedSearchForm data={data} seriesOperationsOptions={NO_OPTIONS} />,
    initialEntries,
  );

const SEARCH_PAGE = <AdvancedSearchForm data={NO_DATASETS} seriesOperationsOptions={NO_OPTIONS} />;
const DATASETS_LIST_PAGE = <p>Liste des jeux de données</p>;

const renderEmptyFields = () =>
  renderWithRouter(
    <FieldsForDatasetsAdvancedSearch
      labelLg1=""
      altIdentifier=""
      creator=""
      disseminationStatus=""
      validationStatus=""
      wasGeneratedIRIs=""
      created=""
      updated=""
      handleChange={vi.fn()}
      seriesOperationsOptions={NO_OPTIONS}
    />,
  );

const datasetRow = (id: string, labelLg1: string, altIdentifier: string) => ({
  id,
  labelLg1,
  creator: "",
  disseminationStatus: "",
  validationStatus: "",
  wasGeneratedIRIs: "",
  created: "",
  updated: "",
  altIdentifier,
});

describe("advanced search component", () => {
  it("filters creators by organization (HIE) and not by stamp", () => {
    renderEmptyFields();

    expect(lastCreatorsInputProps?.mode).toBe("organization");
  });

  it("AdvancedSearchForm renders without crashing", () => {
    renderSearchForm();
  });

  it("FieldsForDatasetsAdvancedSearch renders without crashing", () => {
    renderEmptyFields();
  });

  it("FieldsForDatasetsAdvancedSearch associates each text input with its label", () => {
    renderEmptyFields();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Alternative identifier")).toBeInTheDocument();
  });

  it("AdvancedSearchForm filters datasets by altIdentifier", async () => {
    const user = userEvent.setup();
    const data = [
      datasetRow("1", "Dataset One", "ALT-XYZ"),
      datasetRow("2", "Dataset Two", "OTHER-001"),
    ];

    renderSearchForm(data);

    expect(screen.getByText("Dataset One")).toBeInTheDocument();
    expect(screen.getByText("Dataset Two")).toBeInTheDocument();

    const altIdInput = screen.getByLabelText("Alternative identifier");
    await user.type(altIdInput, "XYZ");

    expect(screen.getByText("Dataset One")).toBeInTheDocument();
    expect(screen.queryByText("Dataset Two")).not.toBeInTheDocument();
  });

  it("AdvancedSearchForm clears every criterion when the reset button is clicked", async () => {
    const data = [
      datasetRow("1", "Dataset One", "ALT-XYZ"),
      datasetRow("2", "Dataset Two", "OTHER-001"),
    ];
    renderSearchForm(data, ["/?altIdentifier=XYZ"]);
    expect(screen.queryByText("Dataset Two")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(screen.getByText("Dataset Two")).toBeInTheDocument();
  });

  it("AdvancedSearchForm goes back to the list of datasets when the back button is clicked", async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={SEARCH_PAGE} />
        <Route path="/datasets" element={DATASETS_LIST_PAGE} />
      </Routes>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste des jeux de données")).toBeVisible();
  });
});
