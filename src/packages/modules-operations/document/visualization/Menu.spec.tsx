import { render, screen } from '@testing-library/react';

import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../../auth/roles';
import { Document } from '../../../model/operations/document';
import { RBACMock } from '../../../tests-utils/rbac';
import { Menu } from './Menu';

describe('Document Visualization Page Menu', () => {
	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu document={{} as Document} type="type" />
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user with INDICATOR_CONTRIBUTOR role can update a document if the stamp match', () => {
		render(
			<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['stamp'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user with INDICATOR_CONTRIBUTOR role cannot update a document if the stamp does not match', () => {
		render(
			<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['fake'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});

	it('a user with SERIES_CONTRIBUTOR role can update a document if the stamp match', () => {
		render(
			<RBACMock roles={[SERIES_CONTRIBUTOR]}>
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['stamp'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user with SERIES_CONTRIBUTOR role cannot update a document if the stamp does not match', () => {
		render(
			<RBACMock roles={[SERIES_CONTRIBUTOR]}>
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['fake'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});

	it('a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document', () => {
		render(
			<RBACMock roles={[]}>
				<Menu document={{} as Document} type="type" />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});
});
