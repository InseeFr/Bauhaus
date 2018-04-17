import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-items-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
