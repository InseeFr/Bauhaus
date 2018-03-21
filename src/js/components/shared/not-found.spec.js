import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './not-found';

describe('not-found', () => {
	it('renders without crashing', () => {
		shallow(<NotFound />);
	});
});
