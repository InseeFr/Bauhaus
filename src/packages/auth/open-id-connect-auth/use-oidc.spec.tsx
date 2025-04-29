import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';

import { UsersApi } from '@sdk/users-api';

import { useOidc } from '../create-oidc';
import { LoggedInWrapper } from './use-oidc';

vi.mock('../create-oidc', () => ({
	useOidc: vi.fn(),
}));

vi.mock('@sdk/users-api', () => ({
	UsersApi: {
		getStamp: vi.fn(),
	},
}));

describe('LoggedInWrapper', () => {
	const mockSaveUserProps = vi.fn();
	const MockComponent = () => (
		<div data-testid="mock-component">Mock Component</div>
	);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('devrait récupérer les informations utilisateur et afficher WrappedComponent', async () => {
		const mockTokens = {
			decodedIdToken: {
				realm_access: {
					roles: ['admin', 'user'],
				},
			},
		};

		(useOidc as Mock).mockReturnValue({
			oidcTokens: mockTokens,
			renewTokens: vi.fn().mockResolvedValue(undefined),
		});

		UsersApi.getStamp.mockResolvedValue({ stamp: '12345' });

		render(
			<LoggedInWrapper
				WrappedComponent={MockComponent}
				saveUserProps={mockSaveUserProps}
			/>,
		);

		// Attendre que les informations utilisateur soient chargées
		await waitFor(() => {
			expect(mockSaveUserProps).toHaveBeenCalledWith({
				roles: ['admin', 'user'],
				stamp: '12345',
			});
		});

		expect(screen.getByTestId('mock-component')).toBeInTheDocument();
	});

	it('ne devrait pas afficher WrappedComponent tant que les informations ne sont pas chargées', () => {
		(useOidc as Mock).mockReturnValue({
			oidcTokens: { decodedIdToken: { realm_access: { roles: [] } } },
			renewTokens: vi.fn().mockResolvedValue(undefined),
		});

		UsersApi.getStamp.mockResolvedValue({ stamp: '12345' });

		const { queryByTestId } = render(
			<LoggedInWrapper
				WrappedComponent={MockComponent}
				saveUserProps={mockSaveUserProps}
			/>,
		);

		expect(queryByTestId('mock-component')).not.toBeInTheDocument();
	});
});
