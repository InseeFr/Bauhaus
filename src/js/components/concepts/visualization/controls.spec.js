import React from 'react';
import { shallow } from 'enzyme';
import ConceptVisualizationControls from './controls';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated="Provisoire"
				conceptVersion="1"
				handleValidation={() => console.log('validate')}
				permission={{ authType: '', roles: [''] }}
			/>
		);
	});
});
