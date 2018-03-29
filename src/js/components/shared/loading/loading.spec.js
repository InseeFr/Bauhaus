import React from 'react';
import { shallow } from 'enzyme';
import Loading from './';

describe('inputMulti', () => {
	it('renders without crashing', () => {
		shallow(<Loading />);
	});
});
