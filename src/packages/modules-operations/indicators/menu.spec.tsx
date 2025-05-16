import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { mockReactQueryForRbac } from '../../tests-utils/render';

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});
	it('an admin can update and publish a family', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_INDICATOR',
				privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
			},
		]);
		const { Menu } = await import('./menu');
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin cannot create or publish a family', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_INDICATOR',
				privileges: [],
			},
		]);
		const { Menu } = await import('./menu');
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
