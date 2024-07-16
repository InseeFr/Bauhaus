import { render, screen } from '@testing-library/react';
import { HomePageMenu } from './menu';
import { Auth } from '../../../utils';
import { RBACMock } from '../../../utils/utils/testing';

describe('Structures Home Page Menu', () => {
	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('an admin can create a new structure if he does have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_structures_RMESGNCS role can create a structure', () => {
		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a structure', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
