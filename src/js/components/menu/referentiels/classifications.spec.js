import React from 'react';
import { shallow } from 'enzyme';
import MenuReferentiels from './';

describe('menu-referenciels', () => {
	it('renders without crashing', () => {
		shallow(<MenuReferentiels />);
	});
});
