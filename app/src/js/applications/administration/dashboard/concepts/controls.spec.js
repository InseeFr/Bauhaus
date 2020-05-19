import React from 'react';
import { render } from '@testing-library/react';
import ConceptDashboardControls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<ConceptDashboardControls />
			</MemoryRouter>
		);
	});
});
