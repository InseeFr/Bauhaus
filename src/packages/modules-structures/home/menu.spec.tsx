import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { HomePageMenu } from './menu';

describe('Structures Home Page Menu', () => {
	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('an admin can create a new structure if he does have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_structures_RMESGNCS role can create a structure', () => {
		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a structure', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
