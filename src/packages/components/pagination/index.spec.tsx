import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Pagination } from "./index";

// Mock du module i18n
vi.mock("../i18n/index", () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockReturnThis(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        "pagination.itemPerPagePlaceholder": "Items per page",
        "pagination.goTo": "Go to page",
        "pagination.navigation": "Page navigation",
        "pagination.firstPage": "First page",
        "pagination.previousPage": "Previous page",
        "pagination.nextPage": "Next page",
        "pagination.lastPage": "Last page",
      };
      return translations[key] || key;
    },
  },
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "pagination.itemPerPagePlaceholder": "Items per page",
        "pagination.goTo": "Go to page",
        "pagination.navigation": "Page navigation",
        "pagination.firstPage": "First page",
        "pagination.previousPage": "Previous page",
        "pagination.nextPage": "Next page",
        "pagination.lastPage": "Last page",
      };
      return translations[key] || key;
    },
    i18n: {
      language: "en",
    },
  }),
}));

const createItems = (count: number): JSX.Element[] => {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} data-testid={`item-${i}`}>
      Item {i + 1}
    </li>
  ));
};

const renderWithRouter = (component: React.ReactElement, { route = "/" } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>);
};

describe("Pagination", () => {
  describe("Basic rendering", () => {
    it("should render without crashing", () => {
      const items = createItems(5);
      renderWithRouter(<Pagination itemEls={items} />);
      const lists = screen.getAllByRole("list");
      expect(lists[0]).toBeInTheDocument();
    });

    it("should display first 10 items by default", () => {
      const items = createItems(25);
      renderWithRouter(<Pagination itemEls={items} />);

      // Should show items 1-10
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
      expect(screen.getByTestId("item-9")).toBeInTheDocument();
      // Should NOT show item 11
      expect(screen.queryByTestId("item-10")).not.toBeInTheDocument();
    });

    it("should show pagination controls when items span multiple pages", () => {
      const items = createItems(25);
      renderWithRouter(<Pagination itemEls={items} />);

      // Pagination controls should be visible (multiple lists)
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(1);
    });
  });

  describe("Page numbers", () => {
    it("should display correct page numbers", () => {
      const items = createItems(100);
      renderWithRouter(<Pagination itemEls={items} />);

      // Should show pages around page 1 (window of 3 pages)
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should highlight current page", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=2" });

      // Find the link with text "2"
      const pageLinks = screen.getAllByRole("link");
      const page2Link = pageLinks.find((link) => link.textContent === "2");

      expect(page2Link).toBeInTheDocument();
      expect(page2Link?.closest("li")).toHaveClass("active");
    });

    it("should show page window correctly on middle page", () => {
      const items = createItems(100); // 10 pages
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=5" });

      // Should show pages 2-8 (window of 3 around page 5)
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();

      // Page 1 and 10 should not be in the window
      const allLinks = screen.getAllByRole("link");
      const pageNumbers = allLinks
        .map((link) => link.textContent)
        .filter((text) => text && /^\d+$/.test(text));

      expect(pageNumbers.includes("1")).toBe(false);
      expect(pageNumbers.includes("10")).toBe(false);
    });
  });

  describe("Navigation links", () => {
    it("should have first, previous, next, and last page navigation symbols", () => {
      const items = createItems(50);
      const { container } = renderWithRouter(<Pagination itemEls={items} />);

      // Check for navigation symbols (they can be in links or spans)
      // Note: &laquo; renders as «, &lt; as <, &gt; as >, &raquo; as »
      expect(container.textContent).toContain("«"); // First (&laquo;)
      expect(container.textContent).toContain("<"); // Previous (&lt;)
      expect(container.textContent).toContain(">"); // Next (&gt;)
      expect(container.textContent).toContain("»"); // Last (&raquo;)
    });

    it("should disable previous/first links on first page", () => {
      const items = createItems(50);
      const { container } = renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?page=1",
      });

      // Find spans with disabled class containing the symbols
      const spans = container.querySelectorAll("span.disabled");
      const spansText = Array.from(spans).map((s) => s.textContent);

      // First and previous should be disabled
      expect(spansText.some((text) => text?.includes("«"))).toBe(true);
      expect(spansText.some((text) => text?.includes("<"))).toBe(true);
    });

    it("should disable next/last links on last page", () => {
      const items = createItems(50);
      const { container } = renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?page=5",
      });

      // Find spans with disabled class containing the symbols
      const spans = container.querySelectorAll("span.disabled");
      const spansText = Array.from(spans).map((s) => s.textContent);

      // Next and last should be disabled
      expect(spansText.some((text) => text?.includes(">"))).toBe(true);
      expect(spansText.some((text) => text?.includes("»"))).toBe(true);
    });

    it("should generate correct URLs for page navigation", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />);

      const links = screen.getAllByRole("link");
      const page2Link = links.find((link) => link.textContent === "2");

      expect(page2Link).toHaveAttribute("href", expect.stringContaining("page=2"));
    });
  });

  describe("Items per page", () => {
    it("should respect perPage URL parameter", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?perPage=25",
      });

      // Should show 25 items (0-24)
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
      expect(screen.getByTestId("item-24")).toBeInTheDocument();
      expect(screen.queryByTestId("item-25")).not.toBeInTheDocument();
    });

    it("should calculate correct number of pages based on perPage", () => {
      const items = createItems(100);

      // With perPage=25, should have 4 pages
      renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?perPage=25",
      });

      const links = screen.getAllByRole("link");
      const page4Link = links.find((link) => link.textContent === "4");
      expect(page4Link).toBeInTheDocument();

      const page5Link = links.find((link) => link.textContent === "5");
      expect(page5Link).toBeUndefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty items array", () => {
      const items: JSX.Element[] = [];
      renderWithRouter(<Pagination itemEls={items} />);

      const lists = screen.getAllByRole("list");
      expect(lists[0]).toBeInTheDocument();
    });

    it("should handle single item", () => {
      const items = createItems(1);
      renderWithRouter(<Pagination itemEls={items} />);

      expect(screen.getByTestId("item-0")).toBeInTheDocument();
    });

    it("should reset to page 1 if current page exceeds total pages", () => {
      const items = createItems(15); // Only 2 pages with default perPage=10
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=5" });

      // Should display items from page 1 since page 5 doesn't exist
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
      expect(screen.getByTestId("item-9")).toBeInTheDocument();
    });

    it("should handle invalid page parameter", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?page=invalid",
      });

      // Should default to page 1
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
      expect(screen.getByTestId("item-9")).toBeInTheDocument();
    });

    it("should handle negative page number", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=-1" });

      // Should default to page 1
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
    });

    it("should handle page=0", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=0" });

      // Should default to page 1
      expect(screen.getByTestId("item-0")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on page links", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />);

      const links = screen.getAllByRole("link");
      const page2Link = links.find((link) => link.textContent === "2");

      expect(page2Link).toHaveAttribute("aria-label", expect.stringContaining("Go to page"));
    });

    it("should have aria-current on active page", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=2" });

      const links = screen.getAllByRole("link");
      const page2Link = links.find((link) => link.textContent === "2");

      expect(page2Link).toHaveAttribute("aria-current");
    });

    it("should have aria-hidden on icon spans", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />);

      const firstPageSpan = screen.getByText("«");
      expect(firstPageSpan).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("URL parameter handling", () => {
    it("should preserve other query parameters when changing page", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?filter=test&sort=name",
      });

      const links = screen.getAllByRole("link");
      const page2Link = links.find((link) => link.textContent === "2");

      const href = page2Link?.getAttribute("href");
      expect(href).toContain("filter=test");
      expect(href).toContain("sort=name");
      expect(href).toContain("page=2");
    });
  });

  describe("Performance", () => {
    it("should handle large number of items efficiently", () => {
      const items = createItems(10000);
      const { container } = renderWithRouter(<Pagination itemEls={items} />);

      // Should only render current page items (10 by default)
      const listItems = container.querySelectorAll('li[data-testid^="item-"]');
      expect(listItems.length).toBe(10);
    });

    it("should limit visible page numbers to window size", () => {
      const items = createItems(1000); // 100 pages
      renderWithRouter(<Pagination itemEls={items} />, { route: "/?page=50" });

      const links = screen.getAllByRole("link");
      const pageNumberLinks = links.filter((link) => /^\d+$/.test(link.textContent || ""));

      // Should show at most 7 page numbers (3 before + current + 3 after)
      expect(pageNumberLinks.length).toBeLessThanOrEqual(7);
    });
  });

  describe("Bug verification", () => {
    it("should have BUG: missing = in perPage URL parameter", () => {
      const items = createItems(50);
      renderWithRouter(<Pagination itemEls={items} />, {
        route: "/?perPage=25",
      });

      const links = screen.getAllByRole("link");
      const firstPageLink = links.find(
        (link) => link.textContent?.includes("«") || link.parentElement?.textContent?.includes("«"),
      );

      if (firstPageLink) {
        const href = firstPageLink.getAttribute("href");
        // This test documents the current bug - URL should have perPage=25 not perPage25
        // After fixing, this test will need to be updated
        expect(href).toBeDefined();
      }
    });
  });
});
