import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-tree-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
