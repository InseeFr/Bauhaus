import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { StructureApi } from '@sdk/index';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { MODIFIED, UNPUBLISHED } from '../../../model/ValidationState';
import { Structure } from '../../../model/structures/Structure';
import { RBACMock } from '../../../tests-utils/rbac';
import Controls from './controls';

vi.mock('@sdk/index', () => ({
	StructureApi: {
		deleteStructure: vi.fn(),
	},
}));

describe('Structure View Menu', () => {
	it('should call handleDelete when DeleteButton is clicked', () => {
		const structure = {
			id: '1',
			contributor: 'someStamp',
			validationState: UNPUBLISHED,
		} as Structure;

		StructureApi.deleteStructure.mockReturnValue(Promise.resolve());

		render(
			<RBACMock roles={[ADMIN]}>
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
		);

		const deleteButton = screen.getByRole('button', { name: /delete/i });
		fireEvent.click(deleteButton);

		expect(StructureApi.deleteStructure).toHaveBeenCalledWith('1');
	});

	it('a user can only see the go back button', () => {
		const structure = { id: '1' } as Structure;
		render(
			<RBACMock roles={[]}>
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Duplicate')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});

	it('an admin can goBack, publish, delete and update a structure even if the stamp is not correct', () => {
		const structure = { id: '1' } as Structure;

		render(
			<RBACMock roles={[ADMIN]}>
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
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
			contributor: ['INSEE'],
			validationState: UNPUBLISHED,
		} as Structure;

		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
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
			contributor: ['INSEE'],
			validationState: MODIFIED,
		} as Structure;

		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]} stamp="INSEE">
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Publish');
		screen.getByText('Duplicate');
		expect(screen.queryByText('Delete')).toBeNull();
		screen.getByText('Update');
	});

	it('an Gestionnaire_jeu_donnees_RMESGNCS can only goBack if the stamp not is correct', () => {
		const structure = { id: '1', contributor: ['INSEE'] } as Structure;

		render(
			<RBACMock roles={[STRUCTURE_CONTRIBUTOR]} stamp="XXXXXX">
				<Controls structure={structure} publish={vi.fn()}></Controls>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Publish')).toBeNull();
		expect(screen.queryByText('Duplicate')).toBeNull();
		expect(screen.queryByText('Delete')).toBeNull();
		expect(screen.queryByText('Update')).toBeNull();
	});
});
