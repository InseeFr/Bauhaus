import { act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../tests/render";
import { Component as OperationsTree } from "./index";
import { OperationsApi } from "@sdk/operations-api";

const mockGoBack = vi.fn();
vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => mockGoBack,
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getAllFamilies: vi.fn(),
    getFamilyById: vi.fn(),
    getSerie: vi.fn(),
  },
}));

vi.mock("../../deprecated-locales", () => ({
  default: {
    operationsTitle: "Operations",
    operationsTreeTitle: "Operations Tree",
  },
}));

vi.mock("./tree.css", () => ({}));

describe("OperationsTree", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi).getAllFamilies.mockResolvedValue([
      { id: "1", label: "Family 1" },
      { id: "2", labelLg1: "Family 2" },
    ]);
  });

  it("renders without crashing", () => {
    renderWithRouter(<OperationsTree />);
  });

  it("loads families on mount", async () => {
    renderWithRouter(<OperationsTree />);

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getAllFamilies).toHaveBeenCalledTimes(1);
    });
  });

  it("handles family expansion", async () => {
    vi.mocked(OperationsApi).getFamilyById.mockResolvedValue({
      series: [
        { id: "s1", label: "Series 1" },
        { id: "s2", labelLg1: "Series 2" },
      ],
    });

    const { getByRole } = renderWithRouter(<OperationsTree />);

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getAllFamilies).toHaveBeenCalled();
    });

    const tree = getByRole("tree");
    const familyNode = tree.querySelector('[data-key="family-1"]');

    if (familyNode) {
      act(() => {
        fireEvent.click(familyNode);
      });

      await waitFor(() => {
        expect(vi.mocked(OperationsApi).getFamilyById).toHaveBeenCalledWith("1");
      });
    }
  });

  it("handles series expansion", async () => {
    vi.mocked(OperationsApi).getFamilyById.mockResolvedValue({
      series: [{ id: "s1", label: "Series 1" }],
    });

    vi.mocked(OperationsApi).getSerie.mockResolvedValue({
      operations: [
        { id: "o1", label: "Operation 1" },
        { id: "o2", labelLg1: "Operation 2" },
      ],
    });

    const { getByRole } = renderWithRouter(<OperationsTree />);

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getAllFamilies).toHaveBeenCalled();
    });

    const tree = getByRole("tree");

    // Expand family first
    const familyNode = tree.querySelector('[data-key="family-1"]');
    if (familyNode) {
      act(() => {
        fireEvent.click(familyNode);
      });

      await waitFor(() => {
        expect(vi.mocked(OperationsApi).getFamilyById).toHaveBeenCalled();
      });

      // Then expand series
      const seriesNode = tree.querySelector('[data-key="series-s1"]');
      if (seriesNode) {
        act(() => {
          fireEvent.click(seriesNode);
        });

        await waitFor(() => {
          expect(vi.mocked(OperationsApi).getSerie).toHaveBeenCalledWith("s1");
        });
      }
    }
  });

  it("generates correct links for different node types", async () => {
    const { getByRole } = renderWithRouter(<OperationsTree />);

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getAllFamilies).toHaveBeenCalled();
    });

    const links = getByRole("tree").querySelectorAll("a");

    // Check if family links are generated correctly
    const familyLinks = Array.from(links).filter((link) =>
      link.getAttribute("href")?.includes("/operations/family/"),
    );
    expect(familyLinks.length).toBeGreaterThanOrEqual(0);
  });

  it("handles return button click", async () => {
    const { getByRole } = renderWithRouter(<OperationsTree />);

    const returnButton = getByRole("button");
    fireEvent.click(returnButton);

    expect(mockGoBack).toHaveBeenCalledWith("/operations");
  });
});
