import React from 'react';
import { shallow } from 'enzyme';
import InputRmes from './';

describe('inputMulti', () => {
	it('renders without crashing', () => {
		const handleChange = () => '';
		shallow(<InputRmes handleChange={handleChange} />);
	});

	it('returns disabled component', () => {
		const handleChange = () => '';
		const wrapper = shallow(<InputRmes handleChange={handleChange} disabled />);
		expect(wrapper.find('input').prop('disabled')).toBe(true);
	});

	it('returns enabled component', () => {
		const handleChange = () => '';
		const wrapper = shallow(<InputRmes handleChange={handleChange} />);
		expect(wrapper.find('input').prop('disabled')).toBe(undefined);
	});

	it('returns starry component', () => {
		const handleChange = () => '';
		const wrapper = shallow(<InputRmes handleChange={handleChange} star />);
		expect(wrapper.find('.boldRed').text()).toBe('*');
	});

	it('returns non-starry component', () => {
		const handleChange = () => '';
		const wrapper = shallow(<InputRmes handleChange={handleChange} />);
		expect(wrapper.find('.boldRed')).toHaveLength(0);
	});
});
