import React from 'react';
import { shallow } from 'enzyme';
import HelpMenu from './menu';

describe('help-menu', () => {
	it('renders without crashing', () => {
		shallow(<HelpMenu content={[]} selectedId="id" />);
	});
});
