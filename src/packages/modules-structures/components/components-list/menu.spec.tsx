import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { RBACMock } from '../../../tests-utils/rbac';
import { HomePageMenu } from './menu';

describe('Components Home Page Menu', () => {
	it('an admin can create a new component if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('an admin can create a new component if he does have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_structures_RMESGNCS role can create a component', () => {
		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a component', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
