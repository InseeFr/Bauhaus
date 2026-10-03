import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ValidationState } from "@components/status";

import { OperationsApi } from "@sdk/operations-api";

import { renderWithAppContext } from "../../../../../tests/render";
import { OperationsFamilyEdition } from "./OperationsFamilyEdition";

vi.mock("react-i18next", async (importOriginal) =>
  (
    await import("../../../../components/translationsByLanguage.testing")
  ).mockTranslationsByLanguage(importOriginal, {
    fr: {
      "common.title": "Intitulé",
      "common.summary": "Résumé",
    },
    en: {
      "common.title": "Title",
      "common.summary": "Summary",
    },
  }),
);

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    createFamily: vi.fn(),
    updateFamily: vi.fn(),
  },
}));

const mockGoBack = vi.fn();

const renderEdition = (
  props: Parameters<typeof OperationsFamilyEdition>[0],
  queryClient = new QueryClient(),
) =>
  renderWithAppContext(
    <QueryClientProvider client={queryClient}>
      <OperationsFamilyEdition {...props} />
    </QueryClientProvider>,
  );

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

  const newFamilyProps = {
    ...defaultProps,
    id: "",
    family: { ...defaultProps.family, id: "" },
  };

  const clickSave = () => fireEvent.click(screen.getByRole("button", { name: /Save/i }));

  const saveNewFamily = () => {
    OperationsApi.createFamily.mockResolvedValueOnce("new-id");
    renderEdition(newFamilyProps);
    clickSave();
  };

  const saveExistingFamily = () => {
    OperationsApi.updateFamily.mockResolvedValueOnce();
    renderEdition(defaultProps);
    clickSave();
  };

  const saveAndWaitForServerError = async () => {
    OperationsApi.updateFamily.mockRejectedValueOnce("Server error");
    renderEdition(defaultProps);
    clickSave();

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component correctly with all required fields", () => {
      renderEdition(defaultProps);

      expect(screen.getByDisplayValue("Test Label 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Label 2")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });

    it("should display page title when editing existing family", () => {
      renderEdition(defaultProps);

      expect(screen.getByText("Test Label 1")).toBeInTheDocument();
    });

    it("should not display page title when creating new family", () => {
      const props = {
        ...defaultProps,
        id: "",
        family: { ...defaultProps.family, id: "" },
      };
      renderEdition(props);

      expect(screen.queryByText("Test Label 1")).not.toBeInTheDocument();
    });

    it("should render markdown editors for both abstract fields", () => {
      renderEdition(defaultProps);

      expect(screen.getByText(/Résumé/)).toBeInTheDocument();
      expect(screen.getByText(/Summary/)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should update prefLabelLg1 when input changes", () => {
      renderEdition(defaultProps);

      const input = screen.getByDisplayValue("Test Label 1") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg1", value: "Updated Label 1" },
      });

      expect(input.value).toBe("Updated Label 1");
    });

    it("should update prefLabelLg2 when input changes", () => {
      renderEdition(defaultProps);

      const input = screen.getByDisplayValue("Test Label 2") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg2", value: "Updated Label 2" },
      });

      expect(input.value).toBe("Updated Label 2");
    });

    it("should clear server error when user modifies input", async () => {
      await saveAndWaitForServerError();

      const input = screen.getByDisplayValue("Test Label 1") as HTMLInputElement;
      fireEvent.change(input, {
        target: { id: "prefLabelLg1", value: "New value" },
      });

      await waitFor(() => {
        expect(screen.queryByText("Server error")).not.toBeInTheDocument();
      });
    });

    it("should call goBack when cancel button is clicked", () => {
      renderEdition(defaultProps);

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
      renderEdition(props);

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
      renderEdition(props);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Save/i })).toBeDisabled();
      });
    });
  });

  describe("API Calls - Creation", () => {
    it("should call createFamily API when creating a new family", async () => {
      saveNewFamily();

      await waitFor(() => {
        expect(OperationsApi.createFamily).toHaveBeenCalledWith(newFamilyProps.family);
        expect(OperationsApi.createFamily).toHaveBeenCalledTimes(1);
      });
    });

    it("should redirect to new family page after successful creation", async () => {
      saveNewFamily();

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalledWith("/operations/family/new-id", true);
      });
    });
  });

  describe("API Calls - Update", () => {
    it("should call updateFamily API when updating an existing family", async () => {
      saveExistingFamily();

      await waitFor(() => {
        expect(OperationsApi.updateFamily).toHaveBeenCalledWith(defaultProps.family);
        expect(OperationsApi.updateFamily).toHaveBeenCalledTimes(1);
      });
    });

    it("should redirect to family page after successful update", async () => {
      saveExistingFamily();

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalledWith("/operations/family/1", false);
      });
    });

    it.each([
      ["the series, whose page shows the label of their family", ["series", "s1"]],
      ["the families offered when editing a series", ["families"]],
    ])("should invalidate %s before opening the family", async (_, queryKey) => {
      const queryClient = new QueryClient();
      queryClient.setQueryData(queryKey, {});
      let invalidatedAtGoBack: boolean | undefined;
      mockGoBack.mockImplementationOnce(() => {
        invalidatedAtGoBack = queryClient.getQueryState(queryKey)?.isInvalidated;
      });
      OperationsApi.updateFamily.mockResolvedValueOnce();
      renderEdition(defaultProps, queryClient);

      clickSave();

      await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
      expect(invalidatedAtGoBack).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should display server-side error if API call fails", async () => {
      await saveAndWaitForServerError();
    });

    it("should display a server field error next to its field, like a client-side error", async () => {
      OperationsApi.updateFamily.mockRejectedValueOnce({
        status: 400,
        errors: [{ field: "prefLabelLg1", message: "must not be blank" }],
      });
      renderEdition(defaultProps);
      clickSave();

      const input = await screen.findByDisplayValue("Test Label 1");
      await waitFor(() => expect(input).toHaveAccessibleDescription("must not be blank"));
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should display in the error banner a server error on a field absent from the form", async () => {
      OperationsApi.updateFamily.mockRejectedValueOnce({
        status: 400,
        errors: [{ field: "created", message: "is not a valid LocalDate" }],
      });
      renderEdition(defaultProps);
      clickSave();

      expect(await screen.findByText("created : is not a valid LocalDate")).toBeInTheDocument();
    });

    it("should not call goBack if API call fails", async () => {
      await saveAndWaitForServerError();

      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should keep showing the loading component until goBack has navigated away", async () => {
      let resolveUpdate: () => void;
      OperationsApi.updateFamily.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveUpdate = resolve;
          }),
      );

      renderEdition(defaultProps);

      fireEvent.click(screen.getByRole("button", { name: /Save/i }));

      expect(screen.getByText(/Saving in progress/i)).toBeInTheDocument();

      resolveUpdate!();

      // La navigation de goBack est asynchrone (navigate(-1), route chargée à la demande) : tant
      // qu'elle n'a pas abouti, le composant reste monté et ne doit pas repasser sur le formulaire.
      await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
      await act(async () => {});
      expect(screen.getByText(/Saving in progress/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Save/i })).not.toBeInTheDocument();
    });
  });

  describe("Component Lifecycle", () => {
    it("should reinitialize state when id prop changes", () => {
      renderEdition(defaultProps);

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

      renderEdition(newProps);

      expect(screen.getByDisplayValue("New Family Label")).toBeInTheDocument();
    });
  });
});
