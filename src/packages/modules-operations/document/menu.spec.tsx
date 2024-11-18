import { render, screen } from '@testing-library/react';

import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { Menu } from './menu';

describe('Document Home Page Menu', () => {
	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New Link');
		screen.getByText('New Document');
	});

	it('a user with INDICATOR_CONTRIBUTOR role can create a document', () => {
		render(
			<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New Link');
		screen.getByText('New Document');
	});

	it('a user with SERIES_CONTRIBUTOR role can create a document', () => {
		render(
			<RBACMock roles={[SERIES_CONTRIBUTOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New Link');
		screen.getByText('New Document');
	});

	it('a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New Link')).toBeNull();
		expect(screen.queryByText('New Document')).toBeNull();
	});
});
