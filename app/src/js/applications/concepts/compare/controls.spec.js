import React from 'react';
import { render } from '@testing-library/react';
import ConceptCompare from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization-compare-controls', () => {
	it('renders without crashing', () => {
		render(<ConceptCompare />, { wrapper: MemoryRouter });
	});
});
