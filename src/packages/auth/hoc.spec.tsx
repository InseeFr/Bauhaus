import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { Provider } from 'react-redux';
import type { Store } from 'redux';

import { withAuth, mapStateToProps } from './hoc';
import { ReduxModel } from '../redux/model';
import { useOidc } from './create-oidc';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';

vi.mock('./create-oidc', () => ({
	useOidc: vi.fn(),
}));

vi.mock('./no-auth/login', () => ({
	default: () => <div data-testid="login-no-auth">Login No Auth</div>,
}));

vi.mock('./open-id-connect-auth/use-oidc', () => ({
	LoginComponent: () => <div data-testid="login-component">Login Component</div>,
	default: ({ WrappedComponent }: { WrappedComponent: () => JSX.Element }) => (
		<div data-testid="logged-in-wrapper">
			<WrappedComponent />
		</div>
	),
}));

describe('mapStateToProps', () => {
	it('should return the auth object with roles when stamp is present', () => {
		const input: Partial<ReduxModel> = {
			app: {
				auth: {
					type: 'OpenIDConnectAuth',
					user: {
						stamp: 'stamp-123',
						roles: ['admin', 'user'],
					},
				},
			},
		};
		const output = {
			authType: 'OpenIDConnectAuth',
			roles: ['admin', 'user']
		};
		expect(mapStateToProps(input as ReduxModel)).toEqual(output);
	});

	it('should return the auth object without roles when stamp is missing', () => {
		const input: Partial<ReduxModel> = {
			app: {
				auth: {
					type: 'NoAuthImpl',
					user: {
						stamp: undefined,
						roles: ['admin'],
					},
				},
			},
		};
		const output = {
			authType: 'NoAuthImpl',
			roles: null
		};
		expect(mapStateToProps(input as ReduxModel)).toEqual(output);
	});

	it('should return the auth object without roles when stamp is empty string', () => {
		const input: Partial<ReduxModel> = {
			app: {
				auth: {
					type: 'OpenIDConnectAuth',
					user: {
						stamp: '',
						roles: ['admin'],
					},
				},
			},
		};
		const output = {
			authType: 'OpenIDConnectAuth',
			roles: null
		};
		expect(mapStateToProps(input as ReduxModel)).toEqual(output);
	});

	it('should handle empty roles array when stamp is present', () => {
		const input: Partial<ReduxModel> = {
			app: {
				auth: {
					type: 'OpenIDConnectAuth',
					user: {
						stamp: 'stamp-123',
						roles: [],
					},
				},
			},
		};
		const output = {
			authType: 'OpenIDConnectAuth',
			roles: []
		};
		expect(mapStateToProps(input as ReduxModel)).toEqual(output);
	});

	it('should handle multiple roles when stamp is present', () => {
		const input: Partial<ReduxModel> = {
			app: {
				auth: {
					type: 'OpenIDConnectAuth',
					user: {
						stamp: 'stamp-456',
						roles: ['admin', 'user', 'moderator'],
					},
				},
			},
		};
		const output = {
			authType: 'OpenIDConnectAuth',
			roles: ['admin', 'user', 'moderator']
		};
		expect(mapStateToProps(input as ReduxModel)).toEqual(output);
	});
});

describe('withAuth', () => {
	const MockComponent = () => <div data-testid="wrapped-component">Wrapped Component</div>;

	const createMockStore = (authType: string, roles: string[] | null): Store => {
		const state = {
			app: {
				auth: {
					type: authType,
					user: {
						stamp: roles ? 'stamp-123' : '',
						roles: roles || [],
					},
				},
			},
		};

		return {
			getState: () => state,
			dispatch: vi.fn(),
			subscribe: vi.fn(),
			replaceReducer: vi.fn(),
		} as unknown as Store;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('OpenID Connect Authentication', () => {
		it('should render LoginComponent when user is not logged in', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore(OPEN_ID_CONNECT_AUTH, null);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.getByTestId('login-component')).toBeInTheDocument();
			expect(screen.queryByTestId('wrapped-component')).not.toBeInTheDocument();
		});

		it('should render LoggedInWrapper with WrappedComponent when user is logged in', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: true,
			});

			const store = createMockStore(OPEN_ID_CONNECT_AUTH, ['admin']);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.getByTestId('logged-in-wrapper')).toBeInTheDocument();
			expect(screen.queryByTestId('login-component')).not.toBeInTheDocument();
		});
	});

	describe('Roles-based Authentication', () => {
		it('should render WrappedComponent when user has valid roles', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore('CustomAuth', ['admin', 'user']);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
		});

		it('should NOT render WrappedComponent when roles array is empty', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore('CustomAuth', []);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.queryByTestId('wrapped-component')).not.toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(screen.getByText('Erreur d\'authentification')).toBeInTheDocument();
		});

		it('should NOT render WrappedComponent when roles is null', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore('CustomAuth', null);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.queryByTestId('wrapped-component')).not.toBeInTheDocument();
		});
	});

	describe('No Authentication (NO_AUTH)', () => {
		it('should render LoginNoAuth component when authType is NO_AUTH', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore(NO_AUTH, null);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.getByTestId('login-no-auth')).toBeInTheDocument();
			expect(screen.queryByTestId('wrapped-component')).not.toBeInTheDocument();
		});
	});

	describe('Error cases', () => {
		it('should render error message for invalid auth type with no roles', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore('InvalidAuthType', null);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(screen.getByText('Erreur d\'authentification')).toBeInTheDocument();
			expect(screen.queryByTestId('wrapped-component')).not.toBeInTheDocument();
		});

		it('should ensure error message has proper accessibility attributes', () => {
			(useOidc as Mock).mockReturnValue({
				isUserLoggedIn: false,
			});

			const store = createMockStore('InvalidAuthType', null);
			const AuthenticatedComponent = withAuth(MockComponent);

			render(
				<Provider store={store}>
					<AuthenticatedComponent />
				</Provider>
			);

			const errorElement = screen.getByRole('alert');
			expect(errorElement).toHaveAttribute('aria-live', 'polite');
		});
	});
});
