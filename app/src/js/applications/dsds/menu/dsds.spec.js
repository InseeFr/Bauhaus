import React from 'react';
import { shallow } from 'enzyme';
import MenuDSDs from '.';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		shallow(<MenuDSDs />);
	});
});
