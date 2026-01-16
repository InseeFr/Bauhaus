import { OperationsApi } from "@sdk/operations-api";

import get, {
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
} from "./list";

const dispatch = vi.fn();

describe("MSD actions", () => {
  it("should call dispatch LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS action with the sorted array", async () => {
    OperationsApi.getMetadataStructureList = function () {
      return Promise.resolve([
        { idMas: "s-1", label: "bbb" },
        { idMas: "s-2", label: "aaa" },
      ]);
    };
    OperationsApi.getMetadataAttributesList = function () {
      return Promise.resolve([
        { id: "s-1", rangeType: "rangeType1" },
        { id: "s-2", rangeType: "rangeType2" },
      ]);
    };
    await get()(dispatch, null);
    expect(dispatch).toHaveBeenCalledWith({
      type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
      payload: {},
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
      payload: {
        results: {
          "s-1": {
            children: {},
            codeList: undefined,
            idMas: "s-1",
            isPresentational: false,
            label: "bbb",
            rangeType: "rangeType1",
          },
          "s-2": {
            children: {},
            codeList: undefined,
            idMas: "s-2",
            isPresentational: false,
            label: "aaa",
            rangeType: "rangeType2",
          },
        },
      },
    });
  });

  it("should call dispatch LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE action with an error object", async () => {
    OperationsApi.getMetadataAttributesList = function () {
      return Promise.reject("error");
    };
    await get()(dispatch, null);
    expect(dispatch).toHaveBeenCalledWith({
      type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
      payload: {},
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
      payload: { err: "error" },
    });
  });
});
