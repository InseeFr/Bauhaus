import { fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Mock, vi } from 'vitest';

import { RBACLink } from '.';
import { useOidc } from '../../auth/create-oidc';
import D from '../../i18n';
import configureStore from '../../redux/configure-store';
import { renderWithAppContext } from '../../tests-utils/render';

vi.mock('../../auth/create-oidc', async () => {
	return {
		useOidc: vi.fn(),
	};
});

vi.mock('react-router-dom', async () => {
	const originalModule = await vi.importActual('react-router-dom');
	return {
		...originalModule,
		useLocation: vi.fn(),
	};
});

vi.stubEnv('VITE_NAME', 'TestApp');
vi.stubEnv('VITE_VERSION', '1.0.0');

const store = configureStore({
	app: {
		auth: {
			type: 'type',
			user: {
				roles: [],
				stamp: 'stamp',
			},
		},
	},
});

describe('RBACLink Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render children and footer correctly', () => {
		(useLocation as Mock).mockReturnValue({ pathname: '/' });
		(useOidc as Mock).mockReturnValue({ isUserLoggedIn: true });

		renderWithAppContext(
			<Provider store={store}>
				<RBACLink>
					<div>Child Component</div>
				</RBACLink>
			</Provider>,
		);

		screen.getByText('Child Component');
		screen.getByText('TestApp - IHM 1.0.0 - API 2.0.0');
		screen.getByAltText('application logo');
	});

	it('should call logout and remove token when logout button is clicked', () => {
		const logout = vi.fn();
		(useLocation as Mock).mockReturnValue({ pathname: '/' });
		(useOidc as Mock).mockReturnValue({ isUserLoggedIn: true, logout });
		renderWithAppContext(
			<Provider store={store}>
				<RBACLink>
					<div>Child Component</div>
				</RBACLink>
			</Provider>,
		);

		const logoutButton = screen.getByRole('button', {
			name: D.authentication.logout,
		});
		fireEvent.click(logoutButton);

		expect(logout).toHaveBeenCalled();
	});
});
