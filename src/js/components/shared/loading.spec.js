import React from 'react';
import { shallow } from 'enzyme';
import Loading from './loading';

describe('inputMulti', () => {
	it('renders without crashing', () => {
		shallow(<Loading />);
	});
});
