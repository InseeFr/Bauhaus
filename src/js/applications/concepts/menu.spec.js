import { render, screen } from '@testing-library/react';
import { Menu } from './menu';
import { Auth } from '../../utils';
import { RBACMock } from '../../utils/utils/testing';

describe('Concepts Home Page Menu', () => {
	it('an admin can create a new concept ', () => {
		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<Menu />
			</RBACMock>
		);

		screen.getByText('New');
	});

	it('a user without Admin role cannot create a concept', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
