import React from 'react';
import { shallow } from 'enzyme';
import Administration from './home';

describe('administration', () => {
	it('renders without crashing', () => {
		shallow(<Administration permission={{ authType: '', roles: [''] }} />);
	});
});
