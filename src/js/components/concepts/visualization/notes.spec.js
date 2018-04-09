import React from 'react';
import { shallow } from 'enzyme';
import ConceptNotesVisualization from './notes';

describe('concept-visualization-notes', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptNotesVisualization
				notes={{}}
				langs={{ lg1: 'fr', lg2: 'en' }}
				secondLang={true}
			/>
		);
	});
});
