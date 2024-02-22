import { render, screen } from '@testing-library/react';
import { RBACMock } from 'bauhaus-utilities/src';
import { ViewMenu } from './menu';
import { Auth } from 'bauhaus-utilities';

describe('Distribution View Menu', () => {
	it('a user can only see the go back button', () => {
		const dataset = {};
		const distribution = {};
		render(
			<RBACMock roles={[]}>
				<ViewMenu dataset={dataset} distribution={distribution}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a distribution even if the stamp is not correct', () => {
		const dataset = {};
		const distribution = {};

		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<ViewMenu dataset={dataset} distribution={distribution}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a distribution if the stamp is correct and validationState is unpublished', () => {
		const dataset = {
			validationState: 'Unpublished',
			catalogRecord: { contributor: 'INSEE' },
		};
		const distribution = {};

		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset} distribution={distribution}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish and update a distribution if the stamp is correct and validationState is published', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: 'INSEE' },
		};
		const distribution = {};

		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset} distribution={distribution}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: 'XXXXXX' },
		};
		const distribution = {};

		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset} distribution={distribution}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
