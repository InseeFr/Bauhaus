import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { usePrivileges } from '@utils/hooks/users';

import { hasAccessToModule } from '../auth/components/auth';
import App from './app';
import { useAppContext } from './app-context';

// Mocks
vi.mock('@utils/hooks/users', () => ({
	usePrivileges: vi.fn(),
}));

vi.mock('@utils/hooks/useTitle', () => ({
	useTitle: vi.fn(),
}));

vi.mock('./app-context', () => ({
	useAppContext: vi.fn(),
}));

vi.mock('../auth/components/auth', () => ({
	hasAccessToModule: vi.fn(),
}));

// Mock translations
vi.mock('../deprecated-locales', () => ({
	default: {
		analyticsTitle: 'Analytics',
		adminTitle: 'Administration',
	},
}));

describe('<App />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders modules the user has access to', () => {
		(usePrivileges as any).mockReturnValue({ privileges: ['admin'] });
		(useAppContext as any).mockReturnValue({
			properties: {
				modules: ['analytics', 'admin', 'users'],
			},
		});

		(hasAccessToModule as any).mockImplementation((module: string) =>
			['analytics', 'admin'].includes(module),
		);

		render(
			<MemoryRouter>
				<App />
			</MemoryRouter>,
		);

		expect(screen.getByText('Analytics')).toBeInTheDocument();
		expect(screen.getByText('Administration')).toBeInTheDocument();

		expect(screen.queryByText('Users')).not.toBeInTheDocument();

		expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute(
			'href',
			'/analytics',
		);
		expect(
			screen.getByRole('link', { name: /administration/i }),
		).toHaveAttribute('href', '/admin');
	});
});
