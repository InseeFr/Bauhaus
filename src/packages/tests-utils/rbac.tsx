import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import configureStore from '../redux/configure-store';

export const RBACMock = ({
	roles = [],
	stamp = 'stamp',
	children,
}: PropsWithChildren<{
	roles: string[];
	stamp?: string;
}>) => {
	const store = configureStore({
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
