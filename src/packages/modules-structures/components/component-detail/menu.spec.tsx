import { render, screen } from '@testing-library/react';

import { Component } from '@model/structures/Component';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { RBACMock } from '../../../tests-utils/rbac';
import { ViewMenu } from './menu';

describe('Component View Menu', () => {
	it('a user can only see the go back button', () => {
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

	it('an admin can not delete if the component is linked to at least one structure', () => {
		const component = { id: '1', structures: ['1'] } as unknown as Component;

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

		expect(screen.queryByText('Delete')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a component even if the stamp is not correct', () => {
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

	it('an Gestionnaire_ structures_RMESGNCS can goBack, publish, delete and update a component if the stamp is correct and validationState is unpublished', () => {
		const component = {
			id: '1',
			contributor: 'INSEE',
			validationState: UNPUBLISHED,
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
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_ structures_RMESGNCS can goBack, publish and update a component if the stamp is correct and validationState is published', () => {
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

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const component = { id: '1', contributor: 'INSEE' } as unknown as Component;

		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]} stamp="XXXXXX">
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
});
