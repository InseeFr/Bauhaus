import { screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RBACLink } from '.';
import D from '../../i18n';
import configureStore from '../../redux/configure-store';
import { renderWithAppContext } from '../../tests-utils/render';
import { removeToken } from '../../auth/open-id-connect-auth/token-utils';
import {vi} from 'vitest';
import { useLocation } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
	const originalModule = await vi.importActual('react-router-dom');
	return {
		...originalModule,
		useLocation: vi.fn(),
	}
});
vi.mock('../../utils/env', () => ({
	getEnvVar: (key: string) => (key === 'NAME' ? 'TestApp' : '1.0.0'),
}));

vi.mock('../../auth/open-id-connect-auth/token-utils', () => ({
	removeToken: vi.fn(),
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
	},
});

describe('RBACLink Component', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render children and footer correctly', () => {
		useLocation.mockReturnValue({ pathname: '/' });

		renderWithAppContext(
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
		useLocation.mockReturnValue({ pathname: '/' });

		renderWithAppContext(
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
