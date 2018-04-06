import React from 'react';
import { shallow } from 'enzyme';
import HelpConcepts from './home';

describe('help-concepts', () => {
	it('renders without crashing', () => {
		shallow(<HelpConcepts />);
	});
});
