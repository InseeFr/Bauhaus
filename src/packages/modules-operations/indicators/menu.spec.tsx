import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { Menu } from './menu';

describe('Family Home Page Menu', () => {
	it('an admin can update and publish a family', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin cannot create or publish a family', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
