import { render, screen } from '@testing-library/react';

import { RBACMock } from '../../tests/rbac';
import { mockReactQueryForRbac } from '../../tests/render';

describe('Document Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_DOCUMENT',
				privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
			},
		]);

		const { Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New Link');
		screen.getByText('New Document');
	});

	it('a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_DOCUMENT',
				privileges: [],
			},
		]);

		const { Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New Link')).toBeNull();
		expect(screen.queryByText('New Document')).toBeNull();
	});
});
