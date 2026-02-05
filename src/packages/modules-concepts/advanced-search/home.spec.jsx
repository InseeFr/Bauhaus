import { renderWithRouter } from "../../tests/render";
import AdvancedSearch from "./home";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: true,
    data: ["data"],
  }),
}));

describe("concepts-advanced-search", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <AdvancedSearch conceptSearchList={[]} stampList={[]} disseminationStatusList={[]} />,
    );
  });
});
