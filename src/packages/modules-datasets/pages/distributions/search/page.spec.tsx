import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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

describe("advanced search component", () => {
  it("renders without crashing", () => {
    renderWithRouter(<AdvancedSearchForm data={[]} seriesOperationsOptions={[]} />);
  });

  it("clears every criterion when the reset button is clicked", async () => {
    const data = [distribution("d1", "Alpha"), distribution("d2", "Beta")];
    renderWithRouter(<AdvancedSearchForm data={data} seriesOperationsOptions={[]} />, [
      "/?distributionLabelLg1=Alpha",
    ]);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("goes back to the list of distributions when the back button is clicked", async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<AdvancedSearchForm data={[]} seriesOperationsOptions={[]} />} />
        <Route path="/datasets/distributions" element={<p>Liste des distributions</p>} />
      </Routes>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste des distributions")).toBeVisible();
  });
});
