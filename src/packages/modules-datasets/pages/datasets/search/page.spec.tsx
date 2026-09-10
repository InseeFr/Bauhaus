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

let lastCreatorsInputProps: Record<string, unknown> | undefined;

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: (props: Record<string, unknown>) => {
    lastCreatorsInputProps = props;
    return <div data-testid="creators-input" />;
  },
}));

describe("advanced search component", () => {
  it("filters creators by organization (HIE) and not by stamp", () => {
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

    expect(lastCreatorsInputProps?.mode).toBe("organization");
  });

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
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Alternative identifier")).toBeInTheDocument();
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

    const altIdInput = screen.getByLabelText("Alternative identifier");
    await user.type(altIdInput, "XYZ");

    expect(screen.getByText("Dataset One")).toBeInTheDocument();
    expect(screen.queryByText("Dataset Two")).not.toBeInTheDocument();
  });
});
