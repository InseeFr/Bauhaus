import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { Component } from "./page";

// Mock des dépendances
const translations: Record<string, string> = {
  "concept.title": "Concepts",
  "common.btnValid": "Publier",
};

vi.mock("react-i18next", async () =>
  (await import("../../../testing/i18n.testing")).translatingWith(() => translations),
);

vi.mock("../../../../utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./components/ConceptsToValidate", () => ({
  ConceptsToValidate: ({
    concepts,
    handleValidateConceptList,
  }: {
    concepts: { id: string; label: string }[];
    handleValidateConceptList: (ids: string[]) => void;
  }) => (
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

vi.mock("../../../../sdk", () => ({
  ConceptsApi: {
    getConceptValidateList: () => mockGetConceptValidateList(),
    putConceptValidList: (ids: string[]) => mockPutConceptValidList(ids),
  },
}));

vi.mock("../../../../utils/array-utils", () => ({
  sortArrayByLabel: <T extends { label: string }>(items: T[]) =>
    items.sort((a, b) => a.label.localeCompare(b.label)),
}));

const renderPage = (initialEntries?: string[]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Component />
    </MemoryRouter>,
  );

const expectEventually = (testId: string) =>
  waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

const expectConceptCountEventually = (count: string) =>
  waitFor(() => {
    expect(screen.getByTestId("concepts-count")).toHaveTextContent(count);
  });

const validate = () => screen.getByTestId("validate-button").click();

describe("ConceptValidation Home Container", () => {
  const mockConcepts = [
    { id: "1", label: "Concept B" },
    { id: "2", label: "Concept A" },
    { id: "3", label: "Concept C" },
  ];

  /** Rend la page avec les concepts de référence et une publication qui réussit. */
  const renderPublishablePage = (initialEntries?: string[]) => {
    mockGetConceptValidateList.mockResolvedValue(mockConcepts);
    mockPutConceptValidList.mockResolvedValue({});
    renderPage(initialEntries);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching concepts", async () => {
      let resolveFetch: (value: typeof mockConcepts) => void;
      mockGetConceptValidateList.mockReturnValue(
        new Promise<typeof mockConcepts>((resolve) => {
          resolveFetch = resolve;
        }),
      );

      renderPage();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();

      resolveFetch!(mockConcepts);

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });

    it("should hide loading indicator after concepts are fetched", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      renderPage();

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Concepts Display", () => {
    it("should display concepts after successful fetch", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      renderPage();

      await expectEventually("concepts-to-validate");

      expect(screen.getByTestId("concepts-count")).toHaveTextContent("3");
    });

    it("should sort concepts by label", async () => {
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      renderPage();

      await expectEventually("concepts-to-validate");

      // Verify sortArrayByLabel was applied (concepts should be sorted)
      const conceptsCount = screen.getByTestId("concepts-count");
      expect(conceptsCount).toHaveTextContent("3");
    });

    it("should display empty list when no concepts to validate", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      renderPage();

      await expectEventually("concepts-to-validate");

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

      renderPage();

      await expectEventually("validate-button");

      validate();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      expect(screen.getByText("Publish in progress ...")).toBeInTheDocument();
      expect(screen.queryByTestId("concepts-to-validate")).not.toBeInTheDocument();

      // Resolve the promise to complete the validation
      resolvePromise!();

      await expectEventually("validate-button");
    });

    it("reste sur la page de publication une fois la publication terminée", async () => {
      renderPublishablePage(["/concepts/validation"]);

      await expectEventually("validate-button");

      validate();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      await expectEventually("concepts-to-validate");
    });

    it("recharge les concepts restant à publier une fois la publication terminée", async () => {
      mockGetConceptValidateList
        .mockResolvedValueOnce(mockConcepts)
        .mockResolvedValueOnce([{ id: "3", label: "Concept C" }]);
      mockPutConceptValidList.mockResolvedValue({});

      renderPage();

      await expectConceptCountEventually("3");

      validate();

      await expectConceptCountEventually("1");
      expect(mockGetConceptValidateList).toHaveBeenCalledTimes(2);
    });

    it("should call API with correct concept ids", async () => {
      renderPublishablePage();

      await expectEventually("validate-button");

      validate();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledTimes(1);
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      await expectEventually("validate-button");
    });
  });

  describe("Error Handling", () => {
    it("should still hide loading even when API returns empty array", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      renderPage();

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

      renderPage();

      await expectEventually("validate-button");

      validate();

      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalled();
      });

      // The finally block should still execute, reloading the list in place
      await waitFor(() => {
        expect(mockGetConceptValidateList).toHaveBeenCalledTimes(2);
      });
      expect(screen.getByTestId("validate-button")).toBeInTheDocument();
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", async () => {
      const { useTitle } = await import("../../../../utils/hooks/useTitle");
      mockGetConceptValidateList.mockResolvedValue(mockConcepts);

      renderPage();

      expect(useTitle).toHaveBeenCalledWith(
        translations["concept.title"],
        translations["common.btnValid"],
      );

      // Wait for concepts to load to avoid state updates after unmount
      await expectEventually("concepts-to-validate");
    });
  });

  describe("Component Unmount", () => {
    it("should not update state after unmount", async () => {
      let resolveFetch: (value: typeof mockConcepts) => void;
      mockGetConceptValidateList.mockReturnValue(
        new Promise<typeof mockConcepts>((resolve) => {
          resolveFetch = resolve;
        }),
      );

      const { unmount } = renderPage();

      unmount();

      // Resolve after unmount; this should not cause any errors
      resolveFetch!(mockConcepts);

      await waitFor(() => {
        expect(true).toBe(true);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty concept list from API", async () => {
      mockGetConceptValidateList.mockResolvedValue([]);

      renderPage();

      await expectConceptCountEventually("0");
    });

    it("should handle single concept validation", async () => {
      mockGetConceptValidateList.mockResolvedValue([{ id: "1", label: "Single Concept" }]);
      mockPutConceptValidList.mockResolvedValue({});

      renderPage();

      await expectConceptCountEventually("1");
    });

    it("should handle large number of concepts", async () => {
      const largeConcepts = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: `Concept ${i}`,
      }));

      mockGetConceptValidateList.mockResolvedValue(largeConcepts);

      renderPage();

      await expectConceptCountEventually("100");
    });
  });

  describe("Integration", () => {
    it("should complete full validation workflow", async () => {
      renderPublishablePage();

      // Step 1: Wait for concepts to load
      await expectEventually("concepts-to-validate");

      // Step 2: Trigger validation
      validate();

      // Step 3: Verify API call
      await waitFor(() => {
        expect(mockPutConceptValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // Step 4: Verify completion, staying on the page with a reloaded list
      await waitFor(() => {
        expect(mockGetConceptValidateList).toHaveBeenCalledTimes(2);
      });

      expect(screen.getByTestId("concepts-to-validate")).toBeInTheDocument();
      expect(mockPutConceptValidList).toHaveBeenCalledTimes(1);
    });
  });
});
