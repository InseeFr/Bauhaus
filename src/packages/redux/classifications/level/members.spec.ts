import { LOADED, LOADING } from "@sdk/constants";

import {
  LOAD_CLASSIFICATION_LEVEL_MEMBERS,
  LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS,
} from "../../actions/constants";
import reducerLevelMembers, { getMembers } from "./members";

describe("reducerLevelMembers", () => {
  test("action LOAD_CLASSIFICATION_LEVEL_MEMBERS", () => {
    const action = {
      type: LOAD_CLASSIFICATION_LEVEL_MEMBERS,
      payload: { classificationId: "nafr2", levelId: "divisions" },
    };
    const result = reducerLevelMembers(
      {
        nafr2: {
          sections: "previous",
        },
      },
      action,
    );
    expect(result).toEqual({
      nafr2: {
        sections: "previous",
        divisions: { status: LOADING },
      },
    });
  });
  test("action LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS", () => {
    const action = {
      type: LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS,
      payload: { classificationId: "nafr2", levelId: "divisions", results: [] },
    };
    const result = reducerLevelMembers(
      {
        nafr2: {
          sections: "previous",
        },
      },
      action,
    );
    expect(result).toEqual({
      nafr2: {
        sections: "previous",
        divisions: { status: LOADED, results: [] },
      },
    });
  });
});

describe("getMembers", () => {
  test("getMembers selector should extract nothing", () => {
    const result = getMembers(
      {
        nafr2: {
          sections: { status: LOADED, results: "members" },
        },
      },
      "nafr2",
      "divisions",
    );
    expect(result).toBe(undefined);
  });
  test("getMembers selector should extract results", () => {
    const result = getMembers(
      {
        nafr2: {
          sections: { status: LOADED, results: "members" },
        },
      },
      "nafr2",
      "sections",
    );
    expect(result).toEqual("members");
  });
});
