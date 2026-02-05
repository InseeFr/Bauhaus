import { renderWithRouter } from "../../../tests/render";
import { AdvancedSearchForm, FieldsForDatasetsAdvancedSearch } from "./search";

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
});
