import { render, screen } from '@testing-library/react';
import { ViewMenu } from './menu';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { RBACMock } from '../../../tests-utils/rbac';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { Dataset, Distribution } from '../../../model/Dataset';

describe('Distribution View Menu', () => {
	it('a user can only see the go back button', () => {
		const dataset = {} as Dataset;
		const distribution = {} as Distribution;
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					dataset={dataset}
					distribution={distribution}
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

	it('an admin can goBack, publish, delete and update a distribution even if the stamp is not correct', () => {
		const dataset = {} as Dataset;
		const distribution = {} as Distribution;

		render(
			<RBACMock roles={[ADMIN]}>
				<ViewMenu
					dataset={dataset}
					distribution={distribution}
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a distribution if the stamp is correct and validationState is unpublished', () => {
		const dataset = {
			validationState: UNPUBLISHED,
			catalogRecord: { contributor: ['INSEE'] },
		} as unknown as Dataset;
		const distribution = {} as Distribution;

		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					distribution={distribution}
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish and update a distribution if the stamp is correct and validationState is published', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: ['INSEE'] },
		} as unknown as Dataset;
		const distribution = {} as Distribution;

		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					distribution={distribution}
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
		const distribution = {} as Distribution;

		render(
			<RBACMock roles={[DATASET_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					dataset={dataset}
					distribution={distribution}
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
