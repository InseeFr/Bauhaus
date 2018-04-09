import React from 'react';
import { shallow } from 'enzyme';
import ConceptVisualizationStandBy from './stand-by';

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		shallow(<ConceptVisualizationStandBy />);
	});
});
