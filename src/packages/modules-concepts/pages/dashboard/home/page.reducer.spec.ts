import { initialState, reducer } from "./page.reducer";

describe("page.reducer", () => {
  it("has correct initial state", () => {
    expect(initialState).toEqual({
      loading: true,
      error: null,
      concepts: [],
      collections: [],
    });
  });

  describe("FETCH_SUCCESS", () => {
    it("updates concepts and collections", () => {
      const concepts = [{ id: "1", label: "Concept A" }] as any;
      const collections = [{ id: "2", label: "Collection A" }] as any;

      const state = reducer(initialState, { type: "FETCH_SUCCESS", concepts, collections });

      expect(state.concepts).toBe(concepts);
      expect(state.collections).toBe(collections);
    });

    it("does not change loading or error", () => {
      const state = reducer(initialState, {
        type: "FETCH_SUCCESS",
        concepts: [],
        collections: [],
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe("FETCH_ERROR", () => {
    it("sets the error", () => {
      const error = new Error("Network failure");

      const state = reducer(initialState, { type: "FETCH_ERROR", error });

      expect(state.error).toBe(error);
    });

    it("does not change loading, concepts or collections", () => {
      const state = reducer(initialState, { type: "FETCH_ERROR", error: "oops" });

      expect(state.loading).toBe(true);
      expect(state.concepts).toEqual([]);
      expect(state.collections).toEqual([]);
    });
  });

  describe("FETCH_COMPLETE", () => {
    it("sets loading to false", () => {
      const state = reducer(initialState, { type: "FETCH_COMPLETE" });

      expect(state.loading).toBe(false);
    });

    it("does not change other fields", () => {
      const state = reducer(initialState, { type: "FETCH_COMPLETE" });

      expect(state.error).toBeNull();
      expect(state.concepts).toEqual([]);
      expect(state.collections).toEqual([]);
    });
  });
});
