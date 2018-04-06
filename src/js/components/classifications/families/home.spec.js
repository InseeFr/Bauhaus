import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const families = [{ id: '1', label: 'Family 1' }];

describe('families-home', () => {
	it('renders without crashing', () => {
		shallow(<Home families={families} />);
	});
});
