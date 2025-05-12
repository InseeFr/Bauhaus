import { Component } from '@model/structures/Component';
import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { RBACMock } from '../../../tests-utils/rbac';

describe('Component View Menu', () => {
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
							application: 'STRUCTURE_STRUCTURE',
							privileges: [],
						},
					],
				}),
			};
		});

		const { ViewMenu } = await import('./menu');

		const component = { id: '1' } as unknown as Component;
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					component={component}
					updatable={true}
					publish={vi.fn()}
					handleUpdate={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a component even if the stamp is not correct', async () => {
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
							application: 'STRUCTURE_COMPONENT',
							privileges: [
								{ privilege: 'DELETE', strategy: 'ALL' },
								{ privilege: 'PUBLISH', strategy: 'ALL' },
								{ privilege: 'UPDATE', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});

		const { ViewMenu } = await import('./menu');
		const component = { id: '1' } as unknown as Component;

		render(
			<RBACMock roles={[ADMIN]}>
				<ViewMenu
					component={component}
					updatable={true}
					publish={vi.fn()}
					handleUpdate={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_ structures_RMESGNCS can goBack, publish and update a component if the stamp is correct and validationState is published', async () => {
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
							application: 'STRUCTURE_COMPONENT',
							privileges: [
								{ privilege: 'DELETE', strategy: 'STAMP' },
								{ privilege: 'PUBLISH', strategy: 'ALL' },
								{ privilege: 'UPDATE', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});

		const { ViewMenu } = await import('./menu');

		const component = {
			id: '1',
			contributor: 'INSEE',
			validationState: 'published',
		} as unknown as Component;

		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					component={component}
					updatable={true}
					publish={vi.fn()}
					handleUpdate={vi.fn()}
					handleDelete={vi.fn()}
					handleBack={vi.fn}
				></ViewMenu>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});
});
