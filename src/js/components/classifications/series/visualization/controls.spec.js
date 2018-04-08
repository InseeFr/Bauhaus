import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-series-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
