import { render, screen } from '@testing-library/react';
import { ViewMenu } from './menu';
import { Auth, RBACMock } from 'js/utils';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';

describe('Dataset View Menu', () => {
	it('a user can only see the go back button', () => {
		const dataset = {};
		render(
			<RBACMock roles={[]}>
				<ViewMenu dataset={dataset}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a dataset even if the stamp is not correct', () => {
		const dataset = {};
		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<ViewMenu dataset={dataset}></ViewMenu>
			</RBACMock>
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
		};
		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish  and update a dataset if the stamp is correct and validationState is unpublished', () => {
		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: 'INSEE' },
		};
		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset}></ViewMenu>
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
		render(
			<RBACMock roles={[Auth.DATASET_CONTRIBUTOR]} stamp={'INSEE'}>
				<ViewMenu dataset={dataset}></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
