import { render, screen } from '@testing-library/react';

import {
	ADMIN,
	COLLECTIONS_CREATOR,
	CONCEPT_CONTRIBUTOR,
} from '../../../auth/roles';
import { RBACMock } from '../../../tests-utils/rbac';
import CollectionVisualizationControls from './controls';

describe('collection-visualization-controls', () => {
	it('a user can go back ', () => {
		render(
			<RBACMock roles={[]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		screen.getByText('Back');
	});

	it('a user can export a collection', () => {
		render(
			<RBACMock roles={[]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		screen.getByText('Export');
	});

	it('a user without Admin or  Proprietaire_collection_concepts_RMESGNCS role cannot update a collection', () => {
		render(
			<RBACMock roles={[]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});

	it('a user with Admin and without  Proprietaire_collection_concepts_RMESGNCS role can update a collection', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user without Admin and with  Proprietaire_collection_concepts_RMESGNCS role can update a collection', () => {
		render(
			<RBACMock roles={[COLLECTIONS_CREATOR]} stamp="stamp">
				<CollectionVisualizationControls creator="stamp" />
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user without Admin and with  Proprietaire_collection_concepts_RMESGNCS role can update a collection if wrong stamp', () => {
		render(
			<RBACMock roles={[COLLECTIONS_CREATOR]} stamp="stamp">
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});

	it('a user without Admin and with  Gestionnaire_concept_RMESGNCS role can update a collection', () => {
		render(
			<RBACMock roles={[CONCEPT_CONTRIBUTOR]} stamp="stamp">
				<CollectionVisualizationControls creator="stamp" />
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user Proprietaire_collection_concepts_RMESGNCS role can publish a collection if not yet validated', () => {
		render(
			<RBACMock roles={[COLLECTIONS_CREATOR]} stamp="stamp">
				<CollectionVisualizationControls creator="stamp" />
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('a user Proprietaire_collection_concepts_RMESGNCS role cannot publish a collection if already validated', () => {
		render(
			<RBACMock roles={[COLLECTIONS_CREATOR]} stamp="stamp">
				<CollectionVisualizationControls creator="stamp" isValidated={true} />
			</RBACMock>,
		);

		expect(screen.queryByText('Publish')).toBeNull();
	});

	it('a user ADMIN role can publish a collection if not yet validated', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('a user Admin role cannot publish a collection if already validated', () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<CollectionVisualizationControls isValidated={true} />
			</RBACMock>,
		);

		expect(screen.queryByText('Publish')).toBeNull();
	});
});
