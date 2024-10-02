import { render, screen } from '@testing-library/react';
import { HomePageMenu } from './menu';
import { RBACMock } from '../../../tests-utils/rbac';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';

describe('Distributions Home Page Menu', () => {
	it('an admin can create a new dataset if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('an admin can create a new dataset if he does have the Gestionnaire_jeu_donnees_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, DATASET_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_jeu_donnees_RMESGNCS role can create a dataset', () => {
		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a dataset', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
