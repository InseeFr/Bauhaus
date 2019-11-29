import React from 'react';
import { shallow } from 'enzyme';
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
		const h2 = <h2 className="col-md-6 col-md-offset-3 page-title">Content</h2>;
		const h4 = <h4 className="col-md-8 col-md-offset-2">Content</h4>;
		expect(wrapper.containsMatchingElement([h2, h4])).toEqual(true);
	});
});
