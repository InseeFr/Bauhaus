import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentProps } from "react";
import { Route, Routes } from "react-router";

import { renderWithRouter } from "../../../../tests/render";
import { SearchDataset } from "../../datasets/search/page";
import { AdvancedSearchForm } from "./page";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: true,
    data: ["data"],
  }),
}));

const distribution = (distributionId: string, distributionLabelLg1: string) => ({
  distributionId,
  distributionLabelLg1,
  distributionValidationStatus: "",
  distributionCreated: "",
  distributionUpdated: "",
  altIdentifier: "",
  dataset: {} as SearchDataset,
});

type SearchDistribution = ComponentProps<typeof AdvancedSearchForm>["data"][number];

const NO_DISTRIBUTIONS: SearchDistribution[] = [];
const NO_OPTIONS: never[] = [];

const renderSearchForm = (
  data: SearchDistribution[] = NO_DISTRIBUTIONS,
  initialEntries?: string[],
) =>
  renderWithRouter(
    <AdvancedSearchForm data={data} seriesOperationsOptions={NO_OPTIONS} />,
    initialEntries,
  );

const SEARCH_PAGE = (
  <AdvancedSearchForm data={NO_DISTRIBUTIONS} seriesOperationsOptions={NO_OPTIONS} />
);
const DISTRIBUTIONS_LIST_PAGE = <p>Liste des distributions</p>;

describe("advanced search component", () => {
  it("renders without crashing", () => {
    renderSearchForm();
  });

  it("clears every criterion when the reset button is clicked", async () => {
    const data = [distribution("d1", "Alpha"), distribution("d2", "Beta")];
    renderSearchForm(data, ["/?distributionLabelLg1=Alpha"]);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("goes back to the list of distributions when the back button is clicked", async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={SEARCH_PAGE} />
        <Route path="/datasets/distributions" element={DISTRIBUTIONS_LIST_PAGE} />
      </Routes>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste des distributions")).toBeVisible();
  });
});
