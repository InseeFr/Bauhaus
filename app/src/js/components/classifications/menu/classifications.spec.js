import React from 'react';
import { shallow } from 'enzyme';
import MenuClassifications from '.';

describe('menu-classifications', () => {
	it('renders without crashing', () => {
		shallow(<MenuClassifications />);
	});
});
