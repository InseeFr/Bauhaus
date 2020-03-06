import React from 'react';
import { render } from '@testing-library/react';
import ConceptsDashboardEdition from './';
import { MemoryRouter } from 'react-router-dom';
describe('dashboard-concepts-edition', () => {
	it('renders without crashing', () => {
		render(<ConceptsDashboardEdition conceptsData={[]} type="creations" />, {
			wrapper: MemoryRouter,
		});
	});
});
