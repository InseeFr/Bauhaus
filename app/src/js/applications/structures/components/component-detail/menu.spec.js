import React from 'react';
import { render, screen } from '@testing-library/react';
import { Auth, RBACMock } from 'js/utils';
import { ViewMenu } from './menu';
describe('Component View Menu', () => {
	it('a user can only see the go back button', () => {
		const component = { id: '1' };
		render(
			<RBACMock roles={[]}>
				<ViewMenu
					component={component}
					updatable={true}
					publish={jest.fn()}
					handleUpdate={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a component even if the stamp is not correct', () => {
		const component = { id: '1' };

		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<ViewMenu
					component={component}
					updatable={true}
					publish={jest.fn()}
					handleUpdate={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn}
				></ViewMenu>
			</RBACMock>
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
			validationState: 'Unpublished',
		};

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					component={component}
					updatable={true}
					publish={jest.fn()}
					handleUpdate={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn}
				></ViewMenu>
			</RBACMock>
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
		};

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<ViewMenu
					component={component}
					updatable={true}
					publish={jest.fn()}
					handleUpdate={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const component = { id: '1', contributor: 'INSEE' };

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="XXXXXX">
				<ViewMenu
					component={component}
					updatable={true}
					publish={jest.fn()}
					handleUpdate={jest.fn()}
					handleDelete={jest.fn()}
					handleBack={jest.fn}
				></ViewMenu>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
