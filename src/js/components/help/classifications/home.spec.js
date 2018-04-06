import React from 'react';
import { shallow } from 'enzyme';
import HelpClassifications from './home';

describe('help-classifications', () => {
	it('renders without crashing', () => {
		shallow(<HelpClassifications />);
	});
});
