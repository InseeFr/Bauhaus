import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const family = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('error', () => {
	it('renders without crashing', () => {
		shallow(<Home family={family} />);
	});
});
