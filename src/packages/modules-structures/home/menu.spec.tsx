import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { DumbHomePageMenu, HomePageMenu } from './menu';

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

	it('should not return import button if isLocal is falsy', () => {
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Import')).toBeNull();
	});

	it('should add import button if isLocal is true', () => {
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Import');
	});

	it('should not return export button if isLocal is falsy', () => {
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={false} />
			</RBACMock>,
		);

		expect(screen.queryByText('Export')).toBeNull();
	});

	it('should add export button if isLocal is true', () => {
		render(
			<RBACMock roles={[]}>
				<DumbHomePageMenu isLocal={true} />
			</RBACMock>,
		);

		screen.getByText('Export');
	});
});
