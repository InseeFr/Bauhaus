import { saveUserProps, checkAuth, CHECK_AUTH, SAVE_USER_PROPS } from "./users";

describe("saveUserProps", () => {
  test("should return the right payload", () => {
    expect(saveUserProps({ target: { checked: true } })).toEqual({
      payload: { target: { checked: true } },
      type: SAVE_USER_PROPS,
    });
  });
});
describe("checkAuth", () => {
  test("should return the right payload", () => {
    expect(checkAuth({ target: { checked: true } })).toEqual({
      payload: { target: { checked: true } },
      type: CHECK_AUTH,
    });
  });
});
