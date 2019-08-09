import React from 'react';
import { shallow } from 'enzyme';
import HelpFooter from './footer';

describe('help-footer', () => {
	it('renders without crashing', () => {
		shallow(<HelpFooter content={[]} selectedId="id" />);
	});
});
