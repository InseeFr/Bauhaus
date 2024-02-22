import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomePageMenu } from './menu';
import { Auth, RBACMock } from 'bauhaus-utilities';

describe('Components Home Page Menu', () => {
	it('an admin can create a new component if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('an admin can create a new component if he does have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_structures_RMESGNCS role can create a component', () => {
		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a component', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
