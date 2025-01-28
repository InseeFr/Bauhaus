import { screen } from '@testing-library/dom';

import { ADMIN, CONCEPT_CONTRIBUTOR, CONCEPTS_CREATOR } from '../../auth/roles';
import { renderWithRouter } from '../../tests-utils/render';
import ConceptVisualizationControls from './menu';

vi.mock('../../sdk');

describe('concept-visualization-controls', () => {
	[
		{
			label: 'without roles',
			roles: [''],
			visibles: ['Back', 'Export'],
		},
		{
			label: 'without roles and concept version higher than 1',
			roles: [''],
			visibles: ['Back', 'Compare', 'Export'],
			conceptVersion: 2,
		},
		{
			label: 'without ADMIN and isValidated is true',
			roles: [ADMIN],
			visibles: ['Back', 'Export', 'Update', 'Delete'],
			conceptVersion: 2,
			isValidated: true,
		},
		{
			label: 'without ADMIN and isValidated is false',
			roles: [ADMIN],
			visibles: ['Back', 'Export', 'Update', 'Publish', 'Delete'],
			conceptVersion: 2,
		},
		{
			label: 'when Admin',
			roles: [ADMIN],
			visibles: ['Back', 'Export'],
		},
		{
			label: 'when Admin and concept version higher than 1',
			roles: [ADMIN],
			visibles: ['Back', 'Compare', 'Export'],
			conceptVersion: 2,
		},
		{
			label: 'when Concept Creator',
			roles: [CONCEPTS_CREATOR],
			visibles: ['Back', 'Export', 'Update'],
		},
		{
			label: 'when Concept Creator and concept version higher than 1',
			roles: [CONCEPTS_CREATOR],
			visibles: ['Back', 'Compare', 'Export', 'Update'],
			conceptVersion: 2,
		},
		{
			label: 'when Concept Contributor',
			roles: [CONCEPT_CONTRIBUTOR],
			visibles: ['Back', 'Export', 'Update'],
		},
		{
			label: 'when Concept Creator and concept version higher than 1',
			roles: [CONCEPT_CONTRIBUTOR],
			visibles: ['Back', 'Compare', 'Export', 'Update'],
			conceptVersion: 2,
		},
	].map(({ label, roles, visibles, conceptVersion, isValidated }) => {
		it(label, () => {
			renderWithRouter(
				<ConceptVisualizationControls
					id="id"
					creator="stamp"
					isValidated={isValidated ?? false}
					conceptVersion={conceptVersion ?? '1'}
					handleValidation={vi.fn()}
					permission={{ authType: '', roles: roles, stamp: 'stamp' }}
					handleDeletion={vi.fn()}
				/>,
			);

			for (const visible of visibles) {
				screen.getByText(visible);
			}
		});
	});
});
