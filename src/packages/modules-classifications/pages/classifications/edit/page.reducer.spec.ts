import { describe, it, expect } from "vitest";
import { reducer, initialState, State } from "./page.reducer";
import { ClassificationWithLevels } from "../../../types";

const mockClassification: ClassificationWithLevels = {
  general: {
    id: "coicop2016",
    prefLabelLg1: "Classification COICOP 2016",
    prefLabelLg2: "COICOP 2016 Classification",
    altLabelLg1: "",
    altLabelLg2: "",
    descriptionLg1: "Description FR",
    descriptionLg2: "Description EN",
    disseminationStatus: "http://bauhaus/codes/base/statutDiffusion/PublicGenerique",
    creator: "DG75-F610",
    contributor: "HIE2000256",
    idSeries: "coicop",
    idAfter: "coicop1998",
    seriesLg1: "COICOP",
    afterLg1: "COICOP 1998",
    issued: "2016-01-01T00:00:00.000+01:00",
    lastRefreshedOn: "2016-01-01T00:00:00.000+01:00",
  },
  levels: [],
};

const stateWithValue: State = {
  ...initialState,
  value: mockClassification,
};

describe("reducer", () => {
  describe("initialState", () => {
    it("should have empty clientSideErrors, submitting false and value undefined", () => {
      expect(initialState).toEqual({
        clientSideErrors: {},
        submitting: false,
        value: undefined,
      });
    });
  });

  describe("SET_VALUE", () => {
    it("should set value", () => {
      const state = reducer(initialState, {
        type: "SET_VALUE",
        payload: mockClassification,
      });
      expect(state.value).toEqual(mockClassification);
    });

    it("should not affect other state properties", () => {
      const state = reducer(initialState, {
        type: "SET_VALUE",
        payload: mockClassification,
      });
      expect(state.submitting).toBe(false);
      expect(state.clientSideErrors).toEqual({});
    });
  });

  describe("SET_GENERAL", () => {
    it("should update general fields when value exists", () => {
      const state = reducer(stateWithValue, {
        type: "SET_GENERAL",
        payload: { prefLabelLg1: "Nouveau libellé" },
      });
      expect(state.value?.general.prefLabelLg1).toBe("Nouveau libellé");
    });

    it("should preserve other general fields", () => {
      const state = reducer(stateWithValue, {
        type: "SET_GENERAL",
        payload: { prefLabelLg1: "Nouveau libellé" },
      });
      expect(state.value?.general.prefLabelLg2).toBe("COICOP 2016 Classification");
      expect(state.value?.general.idSeries).toBe("coicop");
    });

    it("should return state unchanged when value is undefined", () => {
      const state = reducer(initialState, {
        type: "SET_GENERAL",
        payload: { prefLabelLg1: "Nouveau libellé" },
      });
      expect(state).toEqual(initialState);
    });
  });

  describe("SET_ERRORS", () => {
    it("should set clientSideErrors", () => {
      const errors = {
        errorMessage: ["Champ requis"],
        fields: { prefLabelLg1: "Champ requis" },
      };
      const state = reducer(initialState, {
        type: "SET_ERRORS",
        payload: errors,
      });
      expect(state.clientSideErrors).toEqual(errors);
    });

    it("should overwrite previous errors", () => {
      const stateWithErrors: State = {
        ...initialState,
        clientSideErrors: { errorMessage: ["Ancienne erreur"] },
      };
      const state = reducer(stateWithErrors, {
        type: "SET_ERRORS",
        payload: {},
      });
      expect(state.clientSideErrors).toEqual({});
    });
  });

  describe("CLEAR_ERROR_MESSAGE", () => {
    it("should clear errorMessage while keeping fields", () => {
      const stateWithErrors: State = {
        ...initialState,
        clientSideErrors: {
          errorMessage: ["Erreur"],
          fields: { prefLabelLg1: "Champ requis" },
        },
      };
      const state = reducer(stateWithErrors, { type: "CLEAR_ERROR_MESSAGE" });
      expect(state.clientSideErrors.errorMessage).toEqual([]);
      expect(state.clientSideErrors.fields).toEqual({ prefLabelLg1: "Champ requis" });
    });
  });

  describe("SET_SUBMITTING", () => {
    it("should set submitting to true", () => {
      const state = reducer(initialState, { type: "SET_SUBMITTING" });
      expect(state.submitting).toBe(true);
    });

    it("should not affect other state properties", () => {
      const state = reducer(initialState, { type: "SET_SUBMITTING" });
      expect(state.value).toBeUndefined();
      expect(state.clientSideErrors).toEqual({});
    });
  });
});
