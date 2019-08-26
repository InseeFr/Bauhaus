import React from 'react';
import { shallow } from 'enzyme';
import Loading from './';

describe('loading', () => {
	it('renders without crashing', () => {
		shallow(<Loading />);
	});
});
