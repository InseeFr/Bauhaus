import { render, screen } from '@testing-library/react';

import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { Dataset } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { RBACMock } from '../../../tests-utils/rbac';
import { ViewMenu } from './menu';

describe('Dataset View Menu', () => {
	it('a user can only see the go back button', () => {
		const dataset = {} as unknown as Dataset;
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					dataset={dataset}
					onPublish={vi.fn()}
					onDelete={vi.fn()}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a dataset even if the stamp is not correct', () => {
		const dataset = {} as unknown as Dataset;
		render(
			<RBACMock roles={[ADMIN]}>
				<ViewMenu
					dataset={dataset}
					onPublish={vi.fn()}
					onDelete={vi.fn()}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a dataset if the stamp is correct and validationState is unpublished', () => {
		const dataset = {
			validationState: UNPUBLISHED,
			catalogRecord: { contributor: 'INSEE' },
		} as unknown as Dataset;
		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					onPublish={vi.fn()}
					onDelete={vi.fn()}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish  and update a dataset if the stamp is correct and validationState is unpublished', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: ['INSEE'] },
		} as unknown as Dataset;
		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					onPublish={vi.fn()}
					onDelete={vi.fn()}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: ['XXXXXX'] },
		} as unknown as Dataset;
		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					onPublish={vi.fn()}
					onDelete={vi.fn()}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
