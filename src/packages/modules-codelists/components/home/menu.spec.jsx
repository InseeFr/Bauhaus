import { render, screen } from '@testing-library/react';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { RBACMock } from '../../../tests-utils/rbac';
import { HomePageMenu } from './menu';

describe('Codes List Home Page Menu', () => {
	it('an admin can create a new codes list if he does not have the Gestionnaire_liste_codes_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('an admin can create a new codes list if he does have the Gestionnaire_liste_codes_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, CODELIST_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_liste_codes_RMESGNCS role can not create a codes list', () => {
		render(
			<RBACMock roles={[CODELIST_CONTRIBUTOR]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});

	it('a user without Admin or  Gestionnaire_liste_codes_RMESGNCS role cannot create a codes list', () => {
		render(
			<RBACMock roles={[]}>
				<HomePageMenu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
