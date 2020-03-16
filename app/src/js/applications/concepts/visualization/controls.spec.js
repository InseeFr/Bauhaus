import React from 'react';
import { render } from '@testing-library/react';
import ConceptVisualizationControls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated="false"
				conceptVersion="1"
				handleValidation={() => console.log('validate')}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
