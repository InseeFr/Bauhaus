import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { mockReactQueryForRbac } from '../../tests-utils/render';

describe('Structures Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', async () => {
		mockReactQueryForRbac([
			{
				application: 'STRUCTURE_STRUCTURE',
				privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
			},
		]);

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a structure', async () => {
		mockReactQueryForRbac([
			{
				application: 'STRUCTURE_STRUCTURE',
				privileges: [],
			},
		]);

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});

	it('should not return import button if isLocal is falsy', async () => {
		mockReactQueryForRbac([]);

		const { DumbHomePageMenu } = await import('./menu');
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Import')).toBeNull();
	});

	it('should add import button if isLocal is true', async () => {
		mockReactQueryForRbac([]);

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Import');
	});

	it('should not return export button if isLocal is falsy', async () => {
		mockReactQueryForRbac([]);

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Export')).toBeNull();
	});

	it('should add export button if isLocal is true', async () => {
		mockReactQueryForRbac([]);

		const { DumbHomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Export');
	});
});
