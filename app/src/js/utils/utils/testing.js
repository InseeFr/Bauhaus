import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

export const RBACMock = ({ roles = [], stamp = 'stamp', children }) => {
	const mockStore = configureStore([]);

	const store = mockStore({
		users: {
			status: 'LOADED',
			results: {
				stamp,
			},
		},
		app: {
			auth: {
				type: 'type',
				user: {
					roles,
					stamp,
				},
			},
			lg1: 'fr',
			lg2: 'en',
		},
	});

	return (
		<Provider store={store}>
			<MemoryRouter>{children}</MemoryRouter>
		</Provider>
	);
};
