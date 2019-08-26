import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const classifications = [{ id: '1', label: 'Classification 1' }];

describe('classifications-home', () => {
	it('renders without crashing', () => {
		shallow(<Home classifications={classifications} />);
	});
});
