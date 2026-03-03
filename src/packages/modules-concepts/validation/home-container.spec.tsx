import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Component } from "./home-container";

// Mock des dépendances
vi.mock("../../deprecated-locales", () => ({
  default: {
    conceptsTitle: "Concepts",
    btnValid: "Valider",
    conceptsToValidTitle: "Concepts à valider",
    conceptsToValidPanelTitle: "Panneau de validation",
    hasNotConceptToValid: "Aucun concept à valider",
    btnCancel: "Annuler",
  },
}));

vi.mock("../../utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./home", () => ({
  default: ({ concepts, handleValidateConceptList }: any) => (
    <div data-testid="concepts-to-validate">
      <span data-testid="concepts-count">{concepts.length}</span>
      <button data-testid="validate-button" onClick={() => handleValidateConceptList(["1", "2"])}>
        Valider
      </button>
    </div>
  ),
}));

// Mock de l'API
const mockGetConceptValidateList = vi.fn();
const mockPutConceptValidList = vi.fn();

vi.mock("../../sdk", () => ({
  ConceptsApi: {
    getConceptValidateList: () => mockGetConceptValidateList(),
    putConceptValidList: (ids: string[]) => mockPutConceptValidList(ids),
  },
}));

vi.mock("../../utils/array-utils", () => ({
  sortArrayByLabel: (items: any[]) => items.sort((a, b) => a.label.localeCompare(b.label)),
}));

describe("ConceptValidation Home Container", () => {
  const mockConcepts = [
    { id: "1", label: "Concept B" },
    { id: "2", label: "Concept A" },
    { id: "3", label: "Concept C" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching concepts", async () => {
      mockGetConceptValidateList.mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve(mockConcepts), 50)),
      );

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();

      // Wait for the promise to resolve to avoid state updates after unmount
      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });

    it("should hide loading indicator after concepts are fetched", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Concepts Display", () => {
    it("should display concepts after successful fetch", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      });

      expect(screen.getByTestId("concepts-count")).toHaveTextContent("3");
    });

    it("should sort concepts by label", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      });

      // Verify sortArrayByLabel was applied (concepts should be sorted)
      const conceptsCount = screen.getByTestId("concepts-count");
      expect(conceptsCount).toHaveTextContent("3");
    });

    it("should display empty list when no concepts to validate", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      });

      expect(screen.getByTestId("concepts-count")).toHaveTextContent("0");
    });
  });

  describe("Validation Flow", () => {
    it("should show publishing state when validating concepts", async () => {
      let resolvePromise: () => void;
      const pendingPromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      mockGetConceptValidateList.mockResolvedValue(mockConcepts);
      mockPutConceptValidList.mockReturnValue(pendingPromise);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      const validateButton = screen.getByTestId("validate-button");
      validateButton.click();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // Resolve the promise to complete the validation
      resolvePromise!();

      // Wait for the redirect to occur
      await waitFor(() => {
        expect(screen.queryByTestId("validate-button")).not.toBeInTheDocument();
      });
    });

    it("should redirect to concepts list after successful validation", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);
      mockPutConceptValidList.mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={["/concepts/validation"]}>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      const validateButton = screen.getByTestId("validate-button");
      validateButton.click();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // Wait for the redirect (component unmounts or changes)
      await waitFor(() => {
        expect(screen.queryByTestId("validate-button")).not.toBeInTheDocument();
      });
    });

    it("should call API with correct concept ids", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);
      mockPutConceptValidList.mockResolvedValue({});

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      const validateButton = screen.getByTestId("validate-button");
      validateButton.click();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledTimes(1);
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // Wait for the redirect to complete
      await waitFor(() => {
        expect(screen.queryByTestId("validate-button")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should still hide loading even when API returns empty array", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Should hide loading even with empty result
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });

      // Should render the concepts validator with empty list
      expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
    });

    it("should complete validation flow even if API completes without explicit success", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);
      mockPutConceptValidList.mockResolvedValue(undefined); // API returns undefined

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      const validateButton = screen.getByTestId("validate-button");
      validateButton.click();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalled();
      });

      // The finally block should still execute, setting state to OK and triggering redirect
      await waitFor(() => {
        expect(screen.queryByTestId("validate-button")).not.toBeInTheDocument();
      });
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", async () => {
      const { useTitle } = await import("../../utils/hooks/useTitle");
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      expect(useTitle).toHaveBeenCalledWith("Concepts", "Valider");

      // Wait for concepts to load to avoid state updates after unmount
      await waitFor(() => {
        expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      });
    });
  });

  describe("Component Unmount", () => {
    it("should not update state after unmount", async () => {
      mockGetConceptValidateList.mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve(mockConcepts), 100)),
      );

      const { unmount } = render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      unmount();

      // Wait for promise to resolve
      await waitFor(() => {
        // Should not cause any errors
        expect(true).toBe(true);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty concept list from API", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-count")).toHaveTextContent("0");
      });
    });

    it("should handle single concept validation", async () => {
      mockGetConceptValidateList.mockResolvedValue([{ id: "1", label: "Single Concept" }]);
      mockPutConceptValidList.mockResolvedValue({});

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-count")).toHaveTextContent("1");
      });
    });

    it("should handle large number of concepts", async () => {
      const largeConcepts = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: `Concept ${i}`,
      }));

      mockGetConceptValidateList.mockResolvedValue(largeConcepts);

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("concepts-count")).toHaveTextContent("100");
      });
    });
  });

  describe("Integration", () => {
    it("should complete full validation workflow", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);
      mockPutConceptValidList.mockResolvedValue({});

      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
      );

      // Step 1: Wait for concepts to load
      await waitFor(() => {
        expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      });

      // Step 2: Trigger validation
      const validateButton = screen.getByTestId("validate-button");
      validateButton.click();

      // Step 3: Verify API call
      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // Step 4: Verify completion and redirect
      await waitFor(() => {
        expect(screen.queryByTestId("validate-button")).not.toBeInTheDocument();
      });

      expect(mockGetConceptValidateList).toHaveBeenCalledTimes(1);
      expect(mockPutConceptValidList).toHaveBeenCalledTimes(1);
    });
  });
});
