import React from 'react';
import { shallow } from 'enzyme';
import ConceptCompare from './controls';

describe('concept-visualization-compare-controls', () => {
	it('renders without crashing', () => {
		shallow(<ConceptCompare />);
	});
});
