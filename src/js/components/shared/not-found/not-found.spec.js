import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '.';

describe('not-found', () => {
	it('renders without crashing', () => {
		shallow(<NotFound />);
	});
});
