import { render, screen } from '@testing-library/react';

import { RBACMock } from '../../../tests-utils/rbac';
import { mockReactQueryForRbac } from '../../../tests-utils/render';

describe('collection-visualization-controls', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('a user can go back ', async () => {
		mockReactQueryForRbac([
			{
				application: 'CONCEPT_COLLECTION',
				privileges: [
					{ privilege: 'READ', strategy: 'ALL' },
					{ privilege: 'UPDATE', strategy: 'ALL' },
					{ privilege: 'PUBLISH', strategy: 'ALL' },
				],
			},
		]);

		const { default: CollectionVisualizationControls } = await import(
			'./controls'
		);

		render(
			<RBACMock roles={[]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Export');
		screen.getByText('Update');
		screen.getByText('Publish');
	});

	it('a user without Admin or  Proprietaire_collection_concepts_RMESGNCS role cannot update a collection', async () => {
		mockReactQueryForRbac([
			{
				application: 'CONCEPT_COLLECTION',
				privileges: [],
			},
		]);

		const { default: CollectionVisualizationControls } = await import(
			'./controls'
		);

		render(
			<RBACMock roles={[]}>
				<CollectionVisualizationControls />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
		expect(screen.queryByText('Publish')).toBeNull();
	});
});
