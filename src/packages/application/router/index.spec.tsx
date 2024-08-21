import { screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RBACLink } from '.';
import D from '../../i18n';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import { removeToken } from '../../auth/open-id-connect-auth/token-utils';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
	getEnvVar: (key: string) => (key === 'NAME' ? 'TestApp' : '1.0.0'),
}));

jest.mock('../../auth/open-id-connect-auth/token-utils', () => ({
	removeToken: jest.fn(),
}));

const store = configureStore({
	app: {
		auth: {
			type: 'type',
			user: {
				roles: [],
				stamp: 'stamp',
			},
		},
		properties: {
			authorizationHost: 'http:/auth-host.com',
		},
		version: '2.0.0',
	},
});

describe('RBACLink Component', () => {
	let useLocationMock: any;

	beforeEach(() => {
		useLocationMock = require('react-router-dom').useLocation;
	});

	it('should render children and footer correctly', () => {
		useLocationMock.mockReturnValue({ pathname: '/' });

		renderWithRouter(
			<Provider store={store}>
				<RBACLink>
					<div>Child Component</div>
				</RBACLink>
			</Provider>
		);

		expect(screen.getByText('Child Component')).not.toBeNull();
		screen.getByText('TestApp - Front 1.0.0 - API 2.0.0');
		screen.getByAltText('application logo');
	});

	it('should call logout and remove token when logout button is clicked', () => {
		useLocationMock.mockReturnValue({ pathname: '/' });

		renderWithRouter(
			<Provider store={store}>
				<RBACLink>
					<div>Child Component</div>
				</RBACLink>
			</Provider>
		);

		const logoutButton = screen.getByText(D.authentication.logout);
		fireEvent.click(logoutButton);

		expect(removeToken).toHaveBeenCalled();
	});
});
