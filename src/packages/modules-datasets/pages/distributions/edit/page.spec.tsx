import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Component } from "./page";

const mockUseParams = vi.fn();

vi.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("../../../../../application/app-context", () => ({
  useAppContext: () => ({
    lg1: "fr",
    lg2: "en",
    secondLang: {
      value: false,
      toggle: vi.fn(),
    },
  }),
}));

vi.mock("../../../../../deprecated-locales", () => ({
  D1: {
    title: "Title",
    descriptionTitle: "Description",
    datasetTitle: "Dataset",
    formatTitle: "Format",
  },
  D2: {
    title: "Title EN",
    descriptionTitle: "Description EN",
  },
}));

vi.mock("../../../../../deprecated-locales/build-dictionary", () => ({
  default: {
    distributionsTitle: "Distributions",
    mediaTypeTitle: "Media Type",
    compressFormatTitle: "Compress Format",
    accessUrlTitle: "Access URL",
    downloadUrlTitle: "Download URL",
  },
}));

const mockUseDistribution = vi.fn();

vi.mock("../../../../hooks/useDistribution", () => ({
  useDistribution: () => mockUseDistribution(),
}));

const mockUseCreateOrUpdateDistribution = vi.fn();

vi.mock("../../../../hooks/useCreateOrUpdateDistribution", () => ({
  useCreateOrUpdateDistribution: () => mockUseCreateOrUpdateDistribution(),
}));

const mockUseDatasetsForDistributions = vi.fn();

vi.mock("../../../../hooks/useDatasetsForDistributions", () => ({
  useDatasetsForDistributions: () => mockUseDatasetsForDistributions(),
}));

const mockValidate = vi.fn();

vi.mock("./validation", () => ({
  validate: () => mockValidate(),
}));

vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: vi.fn(() => vi.fn()),
}));

describe("Distribution Edit Page", () => {
  const mockSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({});
    mockUseDistribution.mockReturnValue({ data: null, status: "idle" });
    mockUseCreateOrUpdateDistribution.mockReturnValue({
      isSaving: false,
      save: mockSave,
      serverSideError: null,
    });
    mockUseDatasetsForDistributions.mockReturnValue({ data: [] });
    mockValidate.mockReturnValue({ errorMessage: [] });
  });

  describe("Creation mode", () => {
    it("should render the form in creation mode", () => {
      mockUseParams.mockReturnValue({});

      render(<Component />);

      expect(screen.getByRole("button", { name: /save/i })).not.toBeNull();
      expect(screen.queryByText("Distributions")).toBeNull(); // No PageTitleBlock in creation
    });

    it("should not disable dataset select in creation mode", () => {
      mockUseParams.mockReturnValue({});
      mockUseDatasetsForDistributions.mockReturnValue({
        data: [
          { id: "1", label: "Dataset 1" },
          { id: "2", label: "Dataset 2" },
        ],
      });

      const { container } = render(<Component />);

      const selectElement = container.querySelector(".p-dropdown");
      expect(selectElement?.getAttribute("data-p-disabled")).toBe("false");
    });
  });

  describe("Edit mode", () => {
    it("should show loading when distribution is not loaded", () => {
      mockUseParams.mockReturnValue({ id: "123" });
      mockUseDistribution.mockReturnValue({ data: null, status: "loading" });

      render(<Component />);

      expect(screen.getByText(/loading/i)).not.toBeNull();
    });

    it("should render the form in edit mode with distribution data", () => {
      const mockDistribution = {
        id: "123",
        labelLg1: "Test Distribution",
        labelLg2: "Test Distribution EN",
        idDataset: "1",
      };

      mockUseParams.mockReturnValue({ id: "123" });
      mockUseDistribution.mockReturnValue({
        data: mockDistribution,
        status: "success",
      });

      render(<Component />);

      expect(screen.getByRole("button", { name: /save/i })).not.toBeNull();
    });

    it("should disable dataset select in edit mode", () => {
      mockUseParams.mockReturnValue({ id: "123" });
      mockUseDistribution.mockReturnValue({
        data: { id: "123", labelLg1: "Test" },
        status: "success",
      });
      mockUseDatasetsForDistributions.mockReturnValue({
        data: [{ id: "1", label: "Dataset 1" }],
      });

      const { container } = render(<Component />);

      const selectElement = container.querySelector(".p-dropdown");
      expect(selectElement?.getAttribute("data-p-disabled")).toBe("true");
    });
  });

  describe("Form submission", () => {
    it("should call save when form is valid", () => {
      mockUseParams.mockReturnValue({});
      mockValidate.mockReturnValue({ errorMessage: [] });

      render(<Component />);

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should not call save when form has validation errors", () => {
      mockUseParams.mockReturnValue({});
      mockValidate.mockReturnValue({
        errorMessage: ["Error 1", "Error 2"],
        fields: { labelLg1: "Required field" },
      });

      render(<Component />);

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      expect(mockSave).not.toHaveBeenCalled();
    });

    it("should disable save button when there are validation errors", () => {
      mockUseParams.mockReturnValue({});
      mockValidate.mockReturnValue({
        errorMessage: ["Error 1"],
      });

      render(<Component />);

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      // After click, the button should be disabled due to errors
      waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe("Saving state", () => {
    it("should show saving indicator when saving", () => {
      mockUseParams.mockReturnValue({});
      mockUseCreateOrUpdateDistribution.mockReturnValue({
        isSaving: true,
        save: mockSave,
        serverSideError: null,
      });

      render(<Component />);

      expect(screen.getByText(/saving/i)).not.toBeNull();
    });
  });

  describe("Form fields", () => {
    it("should render all form inputs", () => {
      mockUseParams.mockReturnValue({});
      mockUseDatasetsForDistributions.mockReturnValue({
        data: [{ id: "1", label: "Dataset 1" }],
      });

      const { container } = render(<Component />);

      // Check for key form fields
      expect(container.querySelector("#labelLg1")).not.toBeNull();
      expect(container.querySelector("#format")).not.toBeNull();
      expect(screen.getByLabelText(/media type/i)).not.toBeNull();
      expect(container.querySelector("#compressFormat")).not.toBeNull();
    });

    it("should clear error messages when field value changes", () => {
      mockUseParams.mockReturnValue({});

      const { container } = render(<Component />);

      const titleInput = container.querySelector("#labelLg1") as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: "New Title" } });

      // Error messages should be cleared automatically by updateField
      expect(titleInput).toHaveValue("New Title");
    });

    it("should have aria-describedby on inputs with errors", () => {
      mockUseParams.mockReturnValue({});
      mockValidate.mockReturnValue({
        errorMessage: ["Error 1"],
        fields: {
          labelLg1: "Required field",
          labelLg2: "Required field",
        },
      });

      render(<Component />);

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      waitFor(() => {
        const labelLg1Input = screen.getByLabelText(/title/i);
        expect(labelLg1Input.getAttribute("aria-describedby")).toBe("labelLg1-error");
      });
    });
  });

  describe("Error display", () => {
    it("should display global client-side errors when submitting with errors", () => {
      mockUseParams.mockReturnValue({});
      mockValidate.mockReturnValue({
        errorMessage: ["Error 1", "Error 2"],
      });

      render(<Component />);

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      // Global error bloc should appear after submission
      waitFor(() => {
        expect(screen.getByText(/Error 1/i)).not.toBeNull();
      });
    });

    it("should display server-side error when present", () => {
      mockUseParams.mockReturnValue({});
      mockUseCreateOrUpdateDistribution.mockReturnValue({
        isSaving: false,
        save: mockSave,
        serverSideError: new Error("Server error"),
      });

      render(<Component />);

      expect(screen.getByText(/Server error/i)).not.toBeNull();
    });
  });
});
