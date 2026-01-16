import { LOADING, NOT_LOADED } from "@sdk/constants";
import { OperationsApi } from "@sdk/operations-api";

import * as A from "../../../actions/constants";
import get, { saveSims } from "./item";

const dispatch = vi.fn();

describe("SIMS actions", () => {
  beforeEach(() => dispatch.mockClear());
  it("should return nothing if the status is LOADING", async () => {
    const getState = () => {
      return { operationsSimsCurrentStatus: LOADING };
    };
    await get("1")(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalledWith();
  });
  describe("get a sims", () => {
    beforeEach(() => {
      OperationsApi.getOperation = vi.fn(() => Promise.resolve({ series: { id: 2 } }));
      OperationsApi.getOperationsWithoutReport = vi.fn(() => ["value1"]);
    });

    it("should call getOperation/getOperationsWithoutReport method and dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims if the status is not LOADING", async () => {
      OperationsApi.getSims = vi.fn((id) => {
        return Promise.resolve({
          label: "bbb",
          idOperation: 3,
          id,
          rubrics: [],
        });
      });

      const getState = () => {
        return { operationsSimsCurrentStatus: NOT_LOADED };
      };
      const id = "1";
      await get(id)(dispatch, getState);

      expect(OperationsApi.getSims).toHaveBeenCalledWith("1");
      expect(OperationsApi.getOperation).toHaveBeenCalledWith(3);
      expect(OperationsApi.getOperationsWithoutReport).toHaveBeenCalledWith(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: A.LOAD_OPERATIONS_SIMS,
        payload: { id },
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
        payload: {
          id,
          label: "bbb",
          rubrics: {},
          idOperation: 3,
          parentsWithoutSims: ["value1"],
        },
      });
    });
    it("should return an empty array for rubrics if the SIMS is empty", async () => {
      OperationsApi.getSims = vi.fn((id) => {
        return Promise.resolve({
          label: "bbb",
          idSims: 3,
          id,
        });
      });
      const getState = () => {
        return { operationsSimsCurrentStatus: NOT_LOADED };
      };
      const id = "1";
      await get(id)(dispatch, getState);

      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
        payload: {
          id,
          label: "bbb",
          rubrics: {},
          idSims: 3,
          parentsWithoutSims: [],
        },
      });
    });

    it("should not call getOperation/getOperationsWithoutReport method and dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims if the status is not LOADING", async () => {
      OperationsApi.getSims = vi.fn((id) => {
        return Promise.resolve({
          label: "bbb",
          idSims: 3,
          id,
          rubrics: [],
        });
      });
      const getState = () => {
        return { operationsSimsCurrentStatus: NOT_LOADED };
      };
      const id = "1";
      await get(id)(dispatch, getState);

      expect(OperationsApi.getSims).toHaveBeenCalledWith("1");
      expect(OperationsApi.getOperation).not.toHaveBeenCalledWith(3);
      expect(OperationsApi.getOperationsWithoutReport).not.toHaveBeenCalledWith(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: A.LOAD_OPERATIONS_SIMS,
        payload: { id },
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
        payload: {
          id,
          label: "bbb",
          rubrics: {},
          idSims: 3,
          parentsWithoutSims: [],
        },
      });
    });
    it("should call dispatch LOAD_OPERATIONS_SIMS_LIST_FAILURE action with the error if the status is not LOADING", async () => {
      OperationsApi.getSims = function () {
        return Promise.reject("error");
      };
      const getState = () => {
        return { operationsSimsCurrentStatus: NOT_LOADED };
      };
      const id = "1";
      await get(id)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: A.LOAD_OPERATIONS_SIMS,
        payload: { id },
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
        payload: { err: "error" },
      });
    });
  });
  describe("save a sims", () => {
    const sims = { id: 1, label: "aaa" };

    beforeEach(() => {
      OperationsApi.putSims = vi.fn(() => {
        return Promise.resolve("");
      });
      OperationsApi.postSims = vi.fn(() => {
        return Promise.resolve("");
      });
      OperationsApi.getOperation = vi.fn(() => Promise.resolve("result get operation"));
      OperationsApi.getSerie = vi.fn(() => Promise.resolve("result get serie"));
      OperationsApi.getIndicatorById = vi.fn(() => Promise.resolve("result get indicator"));
    });

    describe.each`
      method                | id
      ${"getOperation"}     | ${"idOperation"}
      ${"getSerie"}         | ${"idSeries"}
      ${"getIndicatorById"} | ${"idIndicator"}
    `("get labels from parent", ({ method, id }) => {
      const apis = ["getOperation", "getSerie", "getIndicatorById"];

      it(`should call ${method} if the labelLg1 is not defined and if the ${id} is defined`, async () => {
        await saveSims(
          {
            ...sims,
            [id]: 1,
          },
          vi.fn(),
        )(dispatch);

        apis
          .filter((api) => api !== method)
          .forEach((method) => {
            expect(OperationsApi[method]).not.toHaveBeenCalled();
          });
        expect(OperationsApi[method]).toHaveBeenCalledWith(1);
      });

      it(`should not call ${method} if the labelLg1 is defined`, async () => {
        await saveSims(
          {
            ...sims,
            labelLg1: "labelLg1",
          },
          vi.fn(),
        )(dispatch);
        apis.forEach((method) => {
          expect(OperationsApi[method]).not.toHaveBeenCalled();
        });
      });

      it(`should not call getOperation if the labelLg1 is not defined and if the idOperation is not defined`, async () => {
        await saveSims(
          {
            ...sims,
          },
          vi.fn(),
        )(dispatch);
        expect(OperationsApi.getOperation).not.toHaveBeenCalled();
        expect(OperationsApi.getSerie).not.toHaveBeenCalled();
        expect(OperationsApi.getIndicatorById).not.toHaveBeenCalled();
      });
    });

    it("should call putSims method and dispatch SAVE_OPERATIONS_SIMS_SUCCESS action with the udpated sims", async () => {
      await saveSims(sims, vi.fn())(dispatch);

      expect(OperationsApi.putSims).toHaveBeenCalled();
      expect(OperationsApi.postSims).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({
        type: A.SAVE_OPERATIONS_SIMS,
        payload: sims,
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
        payload: sims,
      });
    });

    it("should call postSims method and dispatch SAVE_OPERATIONS_SIMS_SUCCESS action with the udpated sims", async () => {
      const creationSims = { label: "label" };
      await saveSims(creationSims, vi.fn())(dispatch);

      expect(OperationsApi.postSims).toHaveBeenCalled();
      expect(OperationsApi.putSims).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({
        type: A.SAVE_OPERATIONS_SIMS,
        payload: creationSims,
      });
      expect(dispatch).toHaveBeenLastCalledWith({
        type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
        payload: creationSims,
      });
    });
  });
});
