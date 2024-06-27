import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export default function configureStore(initState) {
	return createStore(
		rootReducer,
		initState,
		compose(
			applyMiddleware(thunkMiddleware, loggerMiddleware),
			window.__REDUX_DEVTOOLS_EXTENSION__
				? window.__REDUX_DEVTOOLS_EXTENSION__()
				: f => f
		)
	);
}
