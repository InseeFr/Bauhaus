import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { DumbHomePageMenu, HomePageMenu } from './menu';

describe('Structures Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it.only('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'STRUCTURE_STRUCTURE',
							privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a structure', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'STRUCTURE_STRUCTURE',
							privileges: [],
						},
					],
				}),
			};
		});

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});

	it('should not return import button if isLocal is falsy', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [],
				}),
			};
		});

		const { DumbHomePageMenu } = await import('./menu');
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Import')).toBeNull();
	});

	it('should add import button if isLocal is true', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [],
				}),
			};
		});

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Import');
	});

	it('should not return export button if isLocal is falsy', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [],
				}),
			};
		});

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Export')).toBeNull();
	});

	it('should add export button if isLocal is true', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [],
				}),
			};
		});

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Export');
	});
});
