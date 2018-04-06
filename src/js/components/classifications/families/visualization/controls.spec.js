import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-family-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
