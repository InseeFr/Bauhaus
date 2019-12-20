import React from 'react';
import { shallow } from 'enzyme';
import PageTitle from '../page-title';

import Error from './';

describe('error', () => {
	it('renders without crashing', () => {
		shallow(<Error />);
	});

	it('returns false without home props', () => {
		const wrapper = shallow(<Error />);
		expect(wrapper.find('h1')).toHaveLength(0);
	});

	it('returns true with home props', () => {
		const wrapper = shallow(<Error home />);
		expect(wrapper.find('h1')).toHaveLength(1);
	});

	it('returns true if contains h2 and h4', () => {
		const wrapper = shallow(<Error />);
		expect(wrapper.find(PageTitle)).toHaveLength(1);
		expect(wrapper.find('p')).toHaveLength(1);
	});
});
