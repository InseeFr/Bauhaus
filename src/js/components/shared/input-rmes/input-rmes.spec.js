import React from 'react';
import { shallow } from 'enzyme';
import InputRmes from './';

describe('inputMulti', () => {
	const handleChange = jest.fn();

	it('renders without crashing', () => {
		shallow(<InputRmes handleChange={handleChange} />);
	});

	it('returns disabled component', () => {
		const wrapper = shallow(<InputRmes handleChange={handleChange} disabled />);
		expect(wrapper.find('input').prop('disabled')).toBe(true);
	});

	it('returns enabled component', () => {
		const wrapper = shallow(<InputRmes handleChange={handleChange} />);
		expect(wrapper.find('input').prop('disabled')).toBe(undefined);
	});

	it('returns starry component', () => {
		const wrapper = shallow(<InputRmes handleChange={handleChange} star />);
		expect(wrapper.find('.boldRed').text()).toBe('*');
	});

	it('returns non-starry component', () => {
		const wrapper = shallow(<InputRmes handleChange={handleChange} />);
		expect(wrapper.find('.boldRed')).toHaveLength(0);
	});

	it('should trigger the change event', () => {
		const wrapper = shallow(<InputRmes handleChange={handleChange} />);
		wrapper.find('input').simulate('change', {
			target: {
				value: 'value',
			},
		});
		expect(handleChange).toHaveBeenCalledWith('value');
	});
});
