import { render, screen } from '@testing-library/react';
import { Menu } from './menu';
import { RBACMock } from '../../tests-utils/rbac';
import {
	ADMIN,
	COLLECTIONS_CREATOR,
	CONCEPTS_CONTRIBUTOR,
} from '../../auth/roles';

describe('Distributions Home Page Menu', () => {
	it('an admin can create a new collection if he does not have the Gestionnaire_ensemble_concepts_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('an admin can create a new collection if he does have the Gestionnaire_ensemble_concepts_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, CONCEPTS_CONTRIBUTOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user with Gestionnaire_ensemble_concepts_RMESGNCS role can create a collection', () => {
		render(
			<RBACMock roles={[CONCEPTS_CONTRIBUTOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_ensemble_concepts_RMESGNCS role cannot create a collection', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});

	it('a user can export a collection', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		screen.queryByText('Export');
	});

	it('an admin can pubish collection if he does not have the Proprietaire_collection_concepts_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('an admin can publish collection if he does have the Proprietaire_collection_concepts_RMESGNCS role', () => {
		render(
			<RBACMock roles={[ADMIN, COLLECTIONS_CREATOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('a user with Proprietaire_collection_concepts_RMESGNCS role can publish a collection', () => {
		render(
			<RBACMock roles={[COLLECTIONS_CREATOR]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('a user without Admin or  Proprietaire_collection_concepts_RMESGNCS role cannot publish a collection', () => {
		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('Publish')).toBeNull();
	});
});
