import React from 'react';
import { shallow } from 'enzyme';
import Flag from './';

describe('flag', () => {
	it('renders without crashing', () => {
		shallow(<Flag flag={null} />);
	});
});
