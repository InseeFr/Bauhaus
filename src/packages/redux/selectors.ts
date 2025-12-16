import { ReduxModel } from "./model";

export interface Permission {
  authType: string;
  stamp: string;
}
export const getPermission = (state: ReduxModel) => {
  const {
    type: authType,
    user: { stamp },
  } = state.app!.auth;
  return { authType, stamp };
};

export const getOperationsSimsCurrent = (state: ReduxModel) => {
  return state.operationsSimsCurrent || {};
};
