import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../../auth/roles';
import { Family } from '../../../model/operations/family';
import { RBACMock } from '../../../tests-utils/rbac';
import { Menu } from './menu';

describe('Family Home Page Menu', () => {
	it('an admin can update and publish a family', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu family={{} as Family} publish={vi.fn()} />
			</RBACMock>,
		);

		screen.getByText('Update');
		screen.getByText('Publish');
		screen.getByText('Back');
	});

	it('a user without Admin cannot create or publish a family', () => {
		render(
			<RBACMock roles={[]}>
				<Menu family={{} as Family} publish={vi.fn()} />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
		expect(screen.queryByText('Publish')).toBeNull();
		screen.getByText('Back');
	});
});
