import { render, screen } from '@testing-library/react';
import { HomePageMenu } from './menu';
import { Auth } from '../../../../utils';
import { RBACMock } from '../../../../utils/utils/testing';

describe('Distributions Home Page Menu', () => {
	it('an admin can create a new dataset if he does not have the Gestionnaire_jeu_donnees_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('an admin can create a new dataset if he does have the Gestionnaire_jeu_donnees_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_jeu_donnees_RMESGNCS role can create a dataset', () => {
		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_jeu_donnees_RMESGNCS role cannot create a dataset', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
