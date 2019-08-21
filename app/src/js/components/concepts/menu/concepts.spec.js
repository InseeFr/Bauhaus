import React from 'react';
import { shallow } from 'enzyme';
import MenuConcepts from '.';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		shallow(<MenuConcepts />);
	});
});
