import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import mainReducer from '../reducers/index';

const loggerMiddleware = createLogger();

export default function configureStore() {
  return createStore(
    mainReducer,
    undefined,
    compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
}
