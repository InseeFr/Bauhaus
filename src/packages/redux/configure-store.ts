import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from ".";

export default function configureStore(initState: any) {
  return createStore(
    rootReducer,
    initState,
    compose(
      applyMiddleware(thunkMiddleware),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        : (f: any) => f,
    ),
  );
}
