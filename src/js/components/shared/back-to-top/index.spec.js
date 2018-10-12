import React from 'react';
import { shallow } from 'enzyme';
import BackToTop from './';

describe('BackToTop', () => {
	it('renders without crashing', () => {
		shallow(<BackToTop />);
	});
	it('should contain a href=# link', () => {
		const wrapper = shallow(<BackToTop />);
		expect(wrapper.find('a').prop('href')).toBe('#');
	});
	it('should contain the right text', () => {
		const wrapper = shallow(<BackToTop />);
		expect(wrapper.find('.sticky-text').text()).toBe('Back to Top');
	});
});
