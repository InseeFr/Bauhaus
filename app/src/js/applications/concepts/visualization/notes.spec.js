import React from 'react';
import { render } from '@testing-library/react';
import ConceptNotesVisualization from './notes';

describe('concept-visualization-notes', () => {
	it('renders without crashing', () => {
		render(
			<ConceptNotesVisualization
				notes={{}}
				langs={{ lg1: 'fr', lg2: 'en' }}
				secondLang={true}
			/>
		);
	});
});
