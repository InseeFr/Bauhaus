import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const correspondences = [{ id: '1', label: 'Correspondence 1' }];

describe('correspondences-home', () => {
	it('renders without crashing', () => {
		shallow(<Home correspondences={correspondences} />);
	});
});
