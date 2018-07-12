import React from 'react';
import { shallow } from 'enzyme';
import ConceptDashboardControls from './controls';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(<ConceptDashboardControls />);
	});
});
