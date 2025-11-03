import { fireEvent, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { Mock, vi } from 'vitest';

import { RBACLink } from '.';
import { useAppContext } from '../app-context';
import { useOidc } from '../../auth/create-oidc';
import D from '../../i18n';
import { renderWithAppContext } from '../../tests/render';

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

vi.mock('../app-context', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('../app-context')>();
	return {
		...actual,
		useAppContext: vi.fn(),
	};
});

vi.stubEnv('VITE_NAME', 'TestApp');
vi.stubEnv('VITE_VERSION', '1.0.0');

describe('RBACLink Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render children and footer correctly', () => {
		(useLocation as Mock).mockReturnValue({ pathname: '/' });
		(useOidc as Mock).mockReturnValue({ isUserLoggedIn: true });
		(useAppContext as Mock).mockReturnValue({ version: '2.0.0' });

		renderWithAppContext(
			<RBACLink>
				<div>Child Component</div>
			</RBACLink>,
		);

		screen.getByText('Child Component');
		screen.getByText('TestApp - IHM 1.0.0 - API 2.0.0');
		screen.getByAltText('application logo');
	});

	it('should call logout and remove token when logout button is clicked', () => {
		const logout = vi.fn();
		(useLocation as Mock).mockReturnValue({ pathname: '/' });
		(useOidc as Mock).mockReturnValue({ isUserLoggedIn: true, logout });
		(useAppContext as Mock).mockReturnValue({ version: '2.0.0' });

		renderWithAppContext(
			<RBACLink>
				<div>Child Component</div>
			</RBACLink>,
		);

		const logoutButton = screen.getByRole('button', {
			name: D.authentication.logout,
		});
		fireEvent.click(logoutButton);

		expect(logout).toHaveBeenCalled();
	});
});
