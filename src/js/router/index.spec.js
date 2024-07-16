import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { RBACLink } from '.';
import { removeToken } from '../utils/auth/open-id-connect-auth/token-utils';
import D from '../new-architecture/i18n';
import { Auth } from '../utils';
import configureStore from '../store/configure-store';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: jest.fn(),
}));
jest.mock('../utils/env', () => ({
	getEnvVar: (key) => (key === 'NAME' ? 'TestApp' : '1.0.0'),
}));

jest.mock('../utils/auth/open-id-connect-auth/token-utils', () => ({
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
			authorizationHost: 'http://auth-host.com',
		},
		version: '2.0.0',
	},
});

describe('RBACLink Component', () => {
	let useLocationMock;

	beforeEach(() => {
		useLocationMock = require('react-router-dom').useLocation;
	});

	it('should render children and footer correctly', () => {
		useLocationMock.mockReturnValue({ pathname: '/' });

		render(
			<Provider store={store}>
				<MemoryRouter>
					<RBACLink>
						<div>Child Component</div>
					</RBACLink>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText('Child Component')).not.toBeNull();
		screen.getByText('TestApp - Front 1.0.0 - API 2.0.0');
		screen.getByAltText('application logo');
	});

	it('should call logout and remove token when logout button is clicked', () => {
		useLocationMock.mockReturnValue({ pathname: '/' });

		render(
			<Provider store={store}>
				<MemoryRouter>
					<RBACLink>
						<div>Child Component</div>
					</RBACLink>
				</MemoryRouter>
			</Provider>
		);

		const logoutButton = screen.getByText(D.authentication.logout);
		fireEvent.click(logoutButton);

		expect(removeToken).toHaveBeenCalled();
	});

	it('should show admin link if user is admin and on home page', () => {
		useLocationMock.mockReturnValue({ pathname: '/' });
		Auth.AuthGuard = ({ children }) => children; // Mock AuthGuard to always render children

		render(
			<Provider store={store}>
				<MemoryRouter>
					<RBACLink>
						<div>Child Component</div>
					</RBACLink>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(D.authentication.title)).not.toBeNull();
	});

	it('should not show admin link if user is not on home page', () => {
		useLocationMock.mockReturnValue({ pathname: '/not-home' });
		Auth.AuthGuard = ({ children }) => children; // Mock AuthGuard to always render children

		render(
			<Provider store={store}>
				<MemoryRouter>
					<RBACLink>
						<div>Child Component</div>
					</RBACLink>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.queryByText(D.authentication.title)).toBeNull();
	});
});
