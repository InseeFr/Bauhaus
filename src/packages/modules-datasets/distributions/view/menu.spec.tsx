import { render, screen } from '@testing-library/react';

import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { Dataset, Distribution } from '../../../model/Dataset';
import { UNPUBLISHED, VALIDATED } from '../../../model/ValidationState';
import { RBACMock } from '../../../tests-utils/rbac';

describe('Distribution View Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('a user can only see the go back button', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'DATASET_DISTRIBUTION',
							privileges: [],
						},
					],
				}),
			};
		});
		const { ViewMenu } = await import('./menu');

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

	it('an admin can goBack, publish, delete and update a distribution even if the stamp is not correct', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'DATASET_DISTRIBUTION',
							privileges: [
								{ privilege: 'UPDATE', strategy: 'ALL' },
								{ privilege: 'PUBLISH', strategy: 'ALL' },
								{ privilege: 'DELETE', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});
		const { ViewMenu } = await import('./menu');
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish, delete and update a distribution if the stamp is correct and validationState is unpublished', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'DATASET_DISTRIBUTION',
							privileges: [
								{ privilege: 'UPDATE', strategy: 'ALL' },
								{ privilege: 'PUBLISH', strategy: 'ALL' },
								{ privilege: 'DELETE', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});
		const { ViewMenu } = await import('./menu');

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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can goBack, publish and update a distribution if the stamp is correct and validationState is published', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'DATASET_DISTRIBUTION',
							privileges: [
								{ privilege: 'UPDATE', strategy: 'ALL' },
								{ privilege: 'PUBLISH', strategy: 'ALL' },
								{ privilege: 'DELETE', strategy: 'STAMP' },
							],
						},
					],
				}),
			};
		});
		const { ViewMenu } = await import('./menu');

		const dataset = {
			validationState: VALIDATED,
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'DATASET_DISTRIBUTION',
							privileges: [
								{ privilege: 'UPDATE', strategy: 'STAMP' },
								{ privilege: 'PUBLISH', strategy: 'STAMP' },
								{ privilege: 'DELETE', strategy: 'STAMP' },
							],
						},
					],
				}),
			};
		});
		const { ViewMenu } = await import('./menu');

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
