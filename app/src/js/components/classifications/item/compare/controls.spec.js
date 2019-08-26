import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-item-compare-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
