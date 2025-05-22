import { render, screen } from '@testing-library/react';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { RBACMock } from '../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../tests/render';

describe('Codes List Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('an admin can create a new codes list if he does not have the Gestionnaire_liste_codes_RMESGNCS role', async () => {
		mockReactQueryForRbac([
			{
				application: 'CODESLIST_CODESLIST',
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

	it('a user with Gestionnaire_liste_codes_RMESGNCS role can not create a codes list', async () => {
		mockReactQueryForRbac([
			{
				application: 'CODESLIST_CODESLIST',
				privileges: [],
			},
		]);
		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[CODELIST_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
