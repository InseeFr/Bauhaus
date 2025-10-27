import { render, screen } from '@testing-library/react';

import { UNPUBLISHED } from '@model/ValidationState';

import { Dataset } from '../../../model/Dataset';
import { RBACMock } from '../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../tests/render';

describe('Dataset View Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('a user can only see the go back button', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DATASET',
				privileges: [],
			},
		]);

		const { ViewMenu } = await import('./menu');

		const dataset = {} as unknown as Dataset;
		render(
			<RBACMock>
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

	it('an admin can goBack, publish, delete and update a dataset even if the stamp is not correct', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DATASET',
				privileges: [
					{ privilege: 'UPDATE', strategy: 'ALL' },
					{ privilege: 'DELETE', strategy: 'ALL' },
					{ privilege: 'PUBLISH', strategy: 'ALL' },
				],
			},
		]);

		const { ViewMenu } = await import('./menu');

		const dataset = {} as unknown as Dataset;
		render(
			<RBACMock>
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a dataset if the stamp is correct and validationState is unpublished', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DATASET',
				privileges: [
					{ privilege: 'UPDATE', strategy: 'STAMP' },
					{ privilege: 'DELETE', strategy: 'STAMP' },
					{ privilege: 'PUBLISH', strategy: 'STAMP' },
				],
			},
		]);

		const { ViewMenu } = await import('./menu');

		const dataset = {
			validationState: UNPUBLISHED,
			catalogRecord: { contributor: 'INSEE' },
		} as unknown as Dataset;
		render(
			<RBACMock stamp="INSEE">
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish  and update a dataset if the stamp is correct and validationState is unpublished', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DATASET',
				privileges: [
					{ privilege: 'UPDATE', strategy: 'STAMP' },
					{ privilege: 'DELETE', strategy: 'STAMP' },
					{ privilege: 'PUBLISH', strategy: 'STAMP' },
				],
			},
		]);

		const { ViewMenu } = await import('./menu');

		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: ['INSEE'] },
		} as unknown as Dataset;
		render(
			<RBACMock stamp="INSEE">
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', async () => {
		mockReactQueryForRbac([
			{
				application: 'DATASET_DATASET',
				privileges: [
					{ privilege: 'UPDATE', strategy: 'STAMP' },
					{ privilege: 'DELETE', strategy: 'STAMP' },
					{ privilege: 'PUBLISH', strategy: 'STAMP' },
				],
			},
		]);

		const { ViewMenu } = await import('./menu');

		const dataset = {
			validationState: 'Published',
			catalogRecord: { contributor: ['XXXXXX'] },
		} as unknown as Dataset;
		render(
			<RBACMock stamp="INSEE">
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
