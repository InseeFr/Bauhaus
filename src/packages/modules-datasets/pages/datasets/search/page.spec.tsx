import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderWithRouter } from "../../../../tests/render";
import { AdvancedSearchForm, FieldsForDatasetsAdvancedSearch } from "./page";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: true,
    data: ["data"],
  }),
}));

describe("advanced search component", () => {
  it("AdvancedSearchForm renders without crashing", () => {
    renderWithRouter(<AdvancedSearchForm data={[]} seriesOperationsOptions={[]} />);
  });

  it("FieldsForDatasetsAdvancedSearch renders without crashing", () => {
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
        seriesOperationsOptions={[]}
      />,
    );
  });

  it("FieldsForDatasetsAdvancedSearch associates each text input with its label", () => {
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
        seriesOperationsOptions={[]}
      />,
    );
    expect(screen.getByLabelText("dataset.globalInformation.mainTitle")).toBeInTheDocument();
    expect(screen.getByLabelText("dataset.internalManagement.altId.title")).toBeInTheDocument();
  });

  it("AdvancedSearchForm filters datasets by altIdentifier", async () => {
    const user = userEvent.setup();
    const data = [
      {
        id: "1",
        labelLg1: "Dataset One",
        creator: "",
        disseminationStatus: "",
        validationStatus: "",
        wasGeneratedIRIs: "",
        created: "",
        updated: "",
        altIdentifier: "ALT-XYZ",
      },
      {
        id: "2",
        labelLg1: "Dataset Two",
        creator: "",
        disseminationStatus: "",
        validationStatus: "",
        wasGeneratedIRIs: "",
        created: "",
        updated: "",
        altIdentifier: "OTHER-001",
      },
    ];

    renderWithRouter(<AdvancedSearchForm data={data} seriesOperationsOptions={[]} />);

    expect(screen.getByText("Dataset One")).toBeInTheDocument();
    expect(screen.getByText("Dataset Two")).toBeInTheDocument();

    const altIdInput = screen.getByLabelText("dataset.internalManagement.altId.title");
    await user.type(altIdInput, "XYZ");

    expect(screen.getByText("Dataset One")).toBeInTheDocument();
    expect(screen.queryByText("Dataset Two")).not.toBeInTheDocument();
  });
});
