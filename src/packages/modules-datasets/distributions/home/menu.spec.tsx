import { render, screen } from '@testing-library/react';

import { RBACMock } from '../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../tests/render';

describe('Distributions Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('an admin can create a new distribution if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DISTRIBUTION',
				privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
			},
		]);

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a distribution', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DISTRIBUTION',
				privileges: [],
			},
		]);

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
