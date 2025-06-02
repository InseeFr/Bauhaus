import { render, screen } from '@testing-library/react';

import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { RBACMock } from '../../../tests/rbac';
import { ViewMenu } from './menu';

describe('Codes List View Menu', () => {
	it('a user can only see the go back button', () => {
		const codesList = { id: '1' };
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					codelist={codesList}
					publish={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn()}
					handleUpdate={vi.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a codelist even if the stamp is not correct', () => {
		const codesList = { id: '1' };

		render(
			<RBACMock roles={[ADMIN]}>
				<ViewMenu
					codelist={codesList}
					publish={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn()}
					handleUpdate={vi.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can goBack, publish, delete and update a codelist if the stamp is correct and validationState is unpublished', () => {
		const codesList = {
			id: '1',
			contributor: 'INSEE',
			validationState: UNPUBLISHED,
		};

		render(
			<RBACMock roles={[CODELIST_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					codelist={codesList}
					publish={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn()}
					handleUpdate={vi.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can goBack, publish and update a codelist if the stamp is correct and validationState is published', () => {
		const codesList = {
			id: '1',
			contributor: 'INSEE',
			validationState: 'published',
		};

		render(
			<RBACMock roles={[CODELIST_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					codelist={codesList}
					publish={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn()}
					handleUpdate={vi.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_liste_codes_RMESGNCS can only goBack if the stamp not is correct', () => {
		const codesList = { id: '1', contributor: 'INSEE' };

		render(
			<RBACMock roles={[CODELIST_CONTRIBUTOR]} stamp="XXXXXX">
				<ViewMenu
					codelist={codesList}
					publish={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn()}
					handleUpdate={vi.fn()}
					updatable={true}
					deletable={true}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
