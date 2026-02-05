import { LOADED, LOADING, NOT_LOADED } from "@sdk/constants";

import {
  LOAD_OPERATIONS_SIMS,
  LOAD_OPERATIONS_SIMS_SUCCESS,
  SAVE_OPERATIONS_SIMS,
  SAVE_OPERATIONS_SIMS_SUCCESS,
} from "../actions/constants";
import { operationsSimsCurrentStatus } from "./loadStatus";

describe("operationsSimsCurrentStatus reducer", () => {
  it("should return the previous state", () => {
    expect(operationsSimsCurrentStatus("STATE", { type: "BAD_TYPE" })).toBe("STATE");
  });

  it("should return LOADED", () => {
    expect(
      operationsSimsCurrentStatus("STATE", {
        type: LOAD_OPERATIONS_SIMS_SUCCESS,
      }),
    ).toBe(LOADED);
  });
  it("should return NOT_LOADED", () => {
    expect(
      operationsSimsCurrentStatus("STATE", {
        type: SAVE_OPERATIONS_SIMS_SUCCESS,
      }),
    ).toBe(NOT_LOADED);
  });
  it("should return LOADING", () => {
    expect(operationsSimsCurrentStatus("STATE", { type: LOAD_OPERATIONS_SIMS })).toBe(LOADING);
    expect(operationsSimsCurrentStatus("STATE", { type: SAVE_OPERATIONS_SIMS })).toBe(LOADING);
  });
});
