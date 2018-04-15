import React from 'react';
import { shallow } from 'enzyme';
import MenuHome from './home';

describe('menu-home', () => {
	it('renders without crashing', () => {
		shallow(<MenuHome permission={{ authType: '', roles: [''] }} />);
	});
});
