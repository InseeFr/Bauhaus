import { describe, it, expect } from "vitest";
import { ddiPreviewReducer, initialState } from "./DdiPreview.reducer";

describe("ddiPreviewReducer", () => {
  it("should return the initial state", () => {
    expect(initialState).toEqual({
      format: "DDI3",
      ddiXml: null,
      isLoading: true,
    });
  });

  describe("SET_FORMAT", () => {
    it("should update format to DDI4", () => {
      const result = ddiPreviewReducer(initialState, {
        type: "SET_FORMAT",
        payload: "DDI4",
      });

      expect(result.format).toBe("DDI4");
    });

    it("should update format to DDI3", () => {
      const state = { ...initialState, format: "DDI4" as const };
      const result = ddiPreviewReducer(state, {
        type: "SET_FORMAT",
        payload: "DDI3",
      });

      expect(result.format).toBe("DDI3");
    });

    it("should not change other state properties", () => {
      const state = {
        ...initialState,
        ddiXml: "<xml/>",
        isLoading: false,
      };
      const result = ddiPreviewReducer(state, {
        type: "SET_FORMAT",
        payload: "DDI4",
      });

      expect(result.ddiXml).toBe("<xml/>");
      expect(result.isLoading).toBe(false);
    });
  });

  describe("LOADING", () => {
    it("should set isLoading to true", () => {
      const state = { ...initialState, isLoading: false };
      const result = ddiPreviewReducer(state, { type: "LOADING" });

      expect(result.isLoading).toBe(true);
    });

    it("should not change other state properties", () => {
      const state = {
        ...initialState,
        format: "DDI4" as const,
        ddiXml: "<xml/>",
        isLoading: false,
      };
      const result = ddiPreviewReducer(state, { type: "LOADING" });

      expect(result.format).toBe("DDI4");
      expect(result.ddiXml).toBe("<xml/>");
    });
  });

  describe("LOAD_SUCCESS", () => {
    it("should set isLoading to false and ddiXml to payload", () => {
      const result = ddiPreviewReducer(initialState, {
        type: "LOAD_SUCCESS",
        payload: "<Variable/>",
      });

      expect(result.isLoading).toBe(false);
      expect(result.ddiXml).toBe("<Variable/>");
    });

    it("should not change format", () => {
      const state = { ...initialState, format: "DDI4" as const };
      const result = ddiPreviewReducer(state, {
        type: "LOAD_SUCCESS",
        payload: "<Variable/>",
      });

      expect(result.format).toBe("DDI4");
    });
  });

  describe("LOAD_ERROR", () => {
    it("should set isLoading to false and ddiXml to null", () => {
      const state = {
        ...initialState,
        ddiXml: "<old/>",
        isLoading: true,
      };
      const result = ddiPreviewReducer(state, { type: "LOAD_ERROR" });

      expect(result.isLoading).toBe(false);
      expect(result.ddiXml).toBeNull();
    });

    it("should not change format", () => {
      const state = { ...initialState, format: "DDI4" as const };
      const result = ddiPreviewReducer(state, { type: "LOAD_ERROR" });

      expect(result.format).toBe("DDI4");
    });
  });
});
