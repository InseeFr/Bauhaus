import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/dom";
import { useLocation } from "react-router-dom";
import { describe, expect, it, Mock, vi } from "vitest";

import { renderWithRouter } from "../../tests/render";
import { MenuOperations } from "./index";

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useLocation: vi.fn(),
    useParams: vi.fn().mockReturnValue({}),
  };
});

vi.mock("../hooks/useSims", () => ({
  useSims: vi.fn().mockReturnValue({
    isLoading: false,
    sims: {
      idOperation: null,
      idSeries: null,
      idIndicator: null,
    },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("MenuOperations Component", () => {
  const renderComponent = () =>
    renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <MenuOperations />
      </QueryClientProvider>,
    );

  it("renders correctly with default state", () => {
    (useLocation as Mock).mockReturnValue({ pathname: "/operations/series" });

    renderComponent();

    screen.getByRole("link", { name: "Families" });
    screen.getByRole("link", { name: "Series" });
    screen.getByRole("link", { name: "Operations" });
    screen.getByRole("link", { name: "Indicators" });
    screen.getByRole("link", { name: "Document / Link" });
    screen.getByRole("link", { name: "Help" });
  });

  [
    {
      url: "/operations/families",
      title: "Families",
    },
    {
      url: "/operations/family/1",
      title: "Families",
    },
    {
      url: "/operations/series",
      title: "Series",
    },
    {
      url: "/operations/series/1",
      title: "Series",
    },
    {
      url: "/operations/series/1/sims/create",
      title: "Series",
    },
    {
      url: "/operations/operations",
      title: "Operations",
    },
    {
      url: "/operations/operation/1",
      title: "Operations",
    },
    {
      url: "/operations/operation/1/sims/create",
      title: "Operations",
    },
    {
      url: "/operations/indicators",
      title: "Indicators",
    },
    {
      url: "/operations/indicator/1",
      title: "Indicators",
    },
    {
      url: "/operations/indicator/1/sims/create",
      title: "Indicators",
    },
  ].forEach(({ url, title }) => {
    it(`applies active class to the ${title} item when url is ${url}`, () => {
      (useLocation as Mock).mockReturnValue({ pathname: url });
      renderComponent();
      const seriesMenuItem = screen.getByRole("link", { name: title });
      expect(seriesMenuItem.parentElement?.classList).toContain("active");
    });
  });

  it("renders external link with target attribute", () => {
    (useLocation as Mock).mockReturnValue({ pathname: "/operations/series" });
    renderComponent();

    const helpMenuItem = screen.getByRole("link", { name: "Help" });
    expect(helpMenuItem.getAttribute("target")).toBe("_blank");
  });
});
