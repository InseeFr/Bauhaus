import { describe, expect, it } from "vitest";

import { initialState, reducer, type DistributionEditState } from "./reducer";

describe("Distribution Edit Reducer", () => {
  describe("SET_DISTRIBUTION", () => {
    it("should set the editing distribution", () => {
      const newDistribution = {
        id: "1",
        labelLg1: "Test Distribution",
        labelLg2: "Test Distribution EN",
      };

      const newState = reducer(initialState, {
        type: "SET_DISTRIBUTION",
        payload: newDistribution,
      });

      expect(newState.editingDistribution).toEqual(newDistribution);
      expect(newState.clientSideErrors).toEqual({});
      expect(newState.submitting).toBe(false);
    });

    it("should replace the entire distribution object", () => {
      const currentState: DistributionEditState = {
        editingDistribution: { id: "1", labelLg1: "Old" },
        clientSideErrors: {},
        submitting: false,
      };

      const newDistribution = { id: "2", labelLg2: "New" };

      const newState = reducer(currentState, {
        type: "SET_DISTRIBUTION",
        payload: newDistribution,
      });

      expect(newState.editingDistribution).toEqual(newDistribution);
      expect(newState.editingDistribution).not.toHaveProperty("labelLg1");
    });
  });

  describe("UPDATE_DISTRIBUTION", () => {
    it("should update specific fields in the distribution", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {
          id: "1",
          labelLg1: "Original",
          labelLg2: "Original EN",
        },
        clientSideErrors: {},
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "UPDATE_DISTRIBUTION",
        payload: { labelLg1: "Updated" },
      });

      expect(newState.editingDistribution).toEqual({
        id: "1",
        labelLg1: "Updated",
        labelLg2: "Original EN",
      });
    });

    it("should add new fields to the distribution", () => {
      const currentState: DistributionEditState = {
        editingDistribution: { id: "1" },
        clientSideErrors: {},
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "UPDATE_DISTRIBUTION",
        payload: { format: "CSV", language: "fr" },
      });

      expect(newState.editingDistribution).toEqual({
        id: "1",
        format: "CSV",
        language: "fr",
      });
    });

    it("should not modify other state properties", () => {
      const currentState: DistributionEditState = {
        editingDistribution: { id: "1" },
        clientSideErrors: { errorMessage: ["error"] },
        submitting: true,
      };

      const newState = reducer(currentState, {
        type: "UPDATE_DISTRIBUTION",
        payload: { labelLg1: "Test" },
      });

      expect(newState.clientSideErrors).toEqual({ errorMessage: ["error"] });
      expect(newState.submitting).toBe(true);
    });
  });

  describe("SET_CLIENT_SIDE_ERRORS", () => {
    it("should set client side errors", () => {
      const errors = {
        errorMessage: ["Error 1", "Error 2"],
        fields: { labelLg1: "Required field" },
      };

      const newState = reducer(initialState, {
        type: "SET_CLIENT_SIDE_ERRORS",
        payload: errors,
      });

      expect(newState.clientSideErrors).toEqual(errors);
    });

    it("should replace existing errors", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {},
        clientSideErrors: {
          errorMessage: ["Old error"],
          fields: { labelLg1: "Old error" },
        },
        submitting: false,
      };

      const newErrors = {
        errorMessage: ["New error"],
        fields: { labelLg2: "New error" },
      };

      const newState = reducer(currentState, {
        type: "SET_CLIENT_SIDE_ERRORS",
        payload: newErrors,
      });

      expect(newState.clientSideErrors).toEqual(newErrors);
    });

    it("should handle empty errors", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {},
        clientSideErrors: { errorMessage: ["Error"] },
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "SET_CLIENT_SIDE_ERRORS",
        payload: {},
      });

      expect(newState.clientSideErrors).toEqual({});
    });
  });

  describe("CLEAR_ERROR_MESSAGES", () => {
    it("should clear error messages while keeping field errors", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {},
        clientSideErrors: {
          errorMessage: ["Error 1", "Error 2"],
          fields: { labelLg1: "Field error" },
        },
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "CLEAR_ERROR_MESSAGES",
      });

      expect(newState.clientSideErrors).toEqual({
        errorMessage: [],
        fields: { labelLg1: "Field error" },
      });
    });

    it("should work when no error messages exist", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {},
        clientSideErrors: {
          fields: { labelLg1: "Field error" },
        },
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "CLEAR_ERROR_MESSAGES",
      });

      expect(newState.clientSideErrors).toEqual({
        errorMessage: [],
        fields: { labelLg1: "Field error" },
      });
    });

    it("should work with empty clientSideErrors", () => {
      const newState = reducer(initialState, {
        type: "CLEAR_ERROR_MESSAGES",
      });

      expect(newState.clientSideErrors).toEqual({
        errorMessage: [],
      });
    });
  });

  describe("SET_SUBMITTING", () => {
    it("should set submitting to true", () => {
      const newState = reducer(initialState, {
        type: "SET_SUBMITTING",
        payload: true,
      });

      expect(newState.submitting).toBe(true);
    });

    it("should set submitting to false", () => {
      const currentState: DistributionEditState = {
        editingDistribution: {},
        clientSideErrors: {},
        submitting: true,
      };

      const newState = reducer(currentState, {
        type: "SET_SUBMITTING",
        payload: false,
      });

      expect(newState.submitting).toBe(false);
    });

    it("should not modify other state properties", () => {
      const currentState: DistributionEditState = {
        editingDistribution: { id: "1" },
        clientSideErrors: { errorMessage: ["error"] },
        submitting: false,
      };

      const newState = reducer(currentState, {
        type: "SET_SUBMITTING",
        payload: true,
      });

      expect(newState.editingDistribution).toEqual({ id: "1" });
      expect(newState.clientSideErrors).toEqual({ errorMessage: ["error"] });
    });
  });

  describe("initialState", () => {
    it("should have correct initial values", () => {
      expect(initialState).toEqual({
        editingDistribution: {},
        clientSideErrors: {},
        submitting: false,
      });
    });
  });

  describe("unknown action", () => {
    it("should return current state for unknown action type", () => {
      const currentState: DistributionEditState = {
        editingDistribution: { id: "1" },
        clientSideErrors: { errorMessage: ["error"] },
        submitting: true,
      };

      const newState = reducer(currentState, {
        type: "UNKNOWN_ACTION",
      } as any);

      expect(newState).toEqual(currentState);
    });
  });
});
