import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('error', () => {
	it('renders without crashing', () => {
		shallow(<Controls />);
	});
});
