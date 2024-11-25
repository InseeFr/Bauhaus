import { render, screen } from '@testing-library/react';
import { Menu } from './menu';
import { RBACMock } from '../tests-utils/rbac';
import { ADMIN } from '../auth/roles';

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
