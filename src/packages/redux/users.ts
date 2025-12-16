import { ReduxAction, ReduxAppModel } from "./model";

export const CHECK_AUTH = "CHECK_AUTH";
export const SAVE_USER_PROPS = "SAVE_USER_PROPS";

export const saveUserProps = (props: unknown) => {
  return {
    type: SAVE_USER_PROPS,
    payload: props,
  };
};

export const checkAuth = (body: unknown) => ({
  type: CHECK_AUTH,
  payload: body,
});

const UserReducer = (state: ReduxAppModel = {}, action: ReduxAction) => {
  const { type, payload } = action;
  switch (type) {
    case SAVE_USER_PROPS: {
      return {
        ...state,
        auth: { ...state.auth, user: payload },
      };
    }
    case CHECK_AUTH: {
      return {
        ...state,
        auth: { ...state.auth, user: payload },
      };
    }
    default:
      return state;
  }
};

export default UserReducer;
