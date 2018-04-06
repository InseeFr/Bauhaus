import React from 'react';
import { shallow } from 'enzyme';
import HelpOperations from './home';

describe('help-operations', () => {
	it('renders without crashing', () => {
		shallow(<HelpOperations />);
	});
});
