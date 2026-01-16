import { combineReducers } from "redux";

import classificationsReducers from "./classifications";
import { reducer as geographiesReducer } from "./geographies.action";
import operationsReducers from "./operations";
import codesListReducers from "./operations/codesList";

export default combineReducers({
  ...classificationsReducers,
  ...operationsReducers,
  ...codesListReducers,
  geographies: geographiesReducer,
});
