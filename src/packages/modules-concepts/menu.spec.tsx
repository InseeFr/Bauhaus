import { render, screen } from '@testing-library/react';

import { ADMIN } from '../auth/roles';
import { RBACMock } from '../tests-utils/rbac';
import { Menu } from './menu';

describe('Concepts Home Page Menu', () => {
	it('an admin can create a new concept ', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin role cannot create a concept', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
