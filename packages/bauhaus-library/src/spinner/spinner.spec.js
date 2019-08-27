import React from 'react';
import { shallow } from 'enzyme';
import Spinner from './';

describe('spinner', () => {
	it('renders without crashing', () => {
		shallow(<Spinner />);
	});
});
