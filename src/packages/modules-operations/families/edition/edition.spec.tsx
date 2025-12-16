import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ValidationState } from "@components/status";

import { OperationsApi } from "@sdk/operations-api";

import { renderWithAppContext } from "../../../tests/render";
import OperationsFamilyEdition from "./edition";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    createFamily: vi.fn(),
    updateFamily: vi.fn(),
  },
}));

const mockGoBack = vi.fn();

describe("OperationsFamilyEdition", () => {
  const defaultProps = {
    id: "1",
    family: {
      id: "1",
      prefLabelLg1: "Test Label 1",
      prefLabelLg2: "Test Label 2",
      abstractLg1: "Abstract 1",
      abstractLg2: "Abstract 2",
      validationState: "Unpublished" as ValidationState,
      series: [],
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-06-01T00:00:00.000Z",
    },
    goBack: mockGoBack,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component correctly with all required fields", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      expect(screen.getByDisplayValue("Test Label 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Label 2")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });

    it("should display page title when editing existing family", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      expect(screen.getByText("Test Label 1")).toBeInTheDocument();
    });

    it("should not display page title when creating new family", () => {
      const props = {
        ...defaultProps,
        id: "",
        family: { ...defaultProps.family, id: "" },
      };
      renderWithAppContext(<OperationsFamilyEdition {...props} />);

      expect(screen.queryByText("Test Label 1")).not.toBeInTheDocument();
    });

    it("should render markdown editors for both abstract fields", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      expect(screen.getByText(/Résumé/)).toBeInTheDocument();
      expect(screen.getByText(/Summary/)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should update prefLabelLg1 when input changes", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      const input = screen.getByDisplayValue("Test Label 1") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg1", value: "Updated Label 1" },
      });

      expect(input.value).toBe("Updated Label 1");
    });

    it("should update prefLabelLg2 when input changes", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      const input = screen.getByDisplayValue("Test Label 2") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg2", value: "Updated Label 2" },
      });

      expect(input.value).toBe("Updated Label 2");
    });

    it("should clear server error when user modifies input", async () => {
      OperationsApi.updateFamily.mockRejectedValueOnce("Server error");

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue("Test Label 1") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg1", value: "New value" },
      });

      await waitFor(() => {
        expect(screen.queryByText("Server error")).not.toBeInTheDocument();
      });
    });

    it("should call goBack when cancel button is clicked", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

      expect(mockGoBack).toHaveBeenCalledWith("/operations/families");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors when required fields are empty", async () => {
      const props = {
        ...defaultProps,
        family: { ...defaultProps.family, prefLabelLg1: "", prefLabelLg2: "" },
      };
      renderWithAppContext(<OperationsFamilyEdition {...props} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        const errorElements = screen.getAllByRole("alert");
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it("should disable save button when there are client-side errors", async () => {
      const props = {
        ...defaultProps,
        family: { ...defaultProps.family, prefLabelLg1: "" },
      };
      renderWithAppContext(<OperationsFamilyEdition {...props} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Save/i })).toBeDisabled();
      });
    });
  });

  describe("API Calls - Creation", () => {
    it("should call createFamily API when creating a new family", async () => {
      const props = {
        ...defaultProps,
        id: "",
        family: { ...defaultProps.family, id: "" },
      };
      OperationsApi.createFamily.mockResolvedValueOnce("new-id");

      renderWithAppContext(<OperationsFamilyEdition {...props} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(OperationsApi.createFamily).toHaveBeenCalledWith(props.family);
        expect(OperationsApi.createFamily).toHaveBeenCalledTimes(1);
      });
    });

    it("should redirect to new family page after successful creation", async () => {
      const props = {
        ...defaultProps,
        id: "",
        family: { ...defaultProps.family, id: "" },
      };
      OperationsApi.createFamily.mockResolvedValueOnce("new-id");

      renderWithAppContext(<OperationsFamilyEdition {...props} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalledWith("/operations/family/new-id", true);
      });
    });
  });

  describe("API Calls - Update", () => {
    it("should call updateFamily API when updating an existing family", async () => {
      OperationsApi.updateFamily.mockResolvedValueOnce();

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(OperationsApi.updateFamily).toHaveBeenCalledWith(defaultProps.family);
        expect(OperationsApi.updateFamily).toHaveBeenCalledTimes(1);
      });
    });

    it("should redirect to family page after successful update", async () => {
      OperationsApi.updateFamily.mockResolvedValueOnce();

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalledWith("/operations/family/1", false);
      });
    });
  });

  describe("Error Handling", () => {
    it("should display server-side error if API call fails", async () => {
      OperationsApi.updateFamily.mockRejectedValueOnce("Server error");

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });
    });

    it("should not call goBack if API call fails", async () => {
      OperationsApi.updateFamily.mockRejectedValueOnce("Server error");

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });

      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading component while saving", async () => {
      OperationsApi.updateFamily.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      expect(screen.getByText(/Saving in progress/i)).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.queryByText(/Saving in progress/i)).not.toBeInTheDocument();
        },
        { timeout: 200 },
      );
    });
  });

  describe("Component Lifecycle", () => {
    it("should reinitialize state when id prop changes", () => {
      renderWithAppContext(<OperationsFamilyEdition {...defaultProps} />);

      expect(screen.getByDisplayValue("Test Label 1")).toBeInTheDocument();

      const newProps = {
        ...defaultProps,
        id: "2",
        family: {
          ...defaultProps.family,
          id: "2",
          prefLabelLg1: "New Family Label",
        },
      };

      renderWithAppContext(<OperationsFamilyEdition {...newProps} />);

      expect(screen.getByDisplayValue("New Family Label")).toBeInTheDocument();
    });
  });
});
