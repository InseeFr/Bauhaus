import React from 'react';
import { render, screen } from '@testing-library/react';
import { Auth, RBACMock } from 'js/utils';
import Controls from './controls';
describe('Structure View Menu', () => {
	it('a user can only see the go back button', () => {
		const structure = { id: '1' };
		render(
			<RBACMock roles={[]}>
				<Controls structure={structure}></Controls>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Duplicate')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a structure even if the stamp is not correct', () => {
		const structure = { id: '1' };

		render(
			<RBACMock roles={[Auth.ADMIN]}>
				<Controls structure={structure}></Controls>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Duplicate');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_ structures_RMESGNCS can goBack, publish, delete and update a structure if the stamp is correct and validationState is unpublished', () => {
		const structure = {
			id: '1',
			contributor: 'INSEE',
			validationState: 'Unpublished',
		};

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<Controls structure={structure}></Controls>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Duplicate');
		screen.getByText('Delete');
		screen.getByText('Update');
	});

	it('an Gestionnaire_ structures_RMESGNCS can goBack, publish and update a structure if the stamp is correct and validationState is published', () => {
		const structure = {
			id: '1',
			contributor: 'INSEE',
			validationState: 'published',
		};

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<Controls structure={structure}></Controls>
			</RBACMock>
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Duplicate');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const structure = { id: '1', contributor: 'INSEE' };

		render(
			<RBACMock roles={[Auth.STRUCTURE_CONTRIBUTOR]} stamp="XXXXXX">
				<Controls structure={structure}></Controls>
			</RBACMock>
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Duplicate')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
