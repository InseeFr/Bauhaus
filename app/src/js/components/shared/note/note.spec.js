import React from 'react';
import { shallow } from 'enzyme';
import { Note } from './note';

describe('note', () => {
	it('renders without crashing', () => {
		shallow(<Note />);
	});

	it('renders null component', () => {
		const wrapper = shallow(<Note />);
		expect(wrapper.html()).toBeNull();
	});

	it('renders not null component', () => {
		const wrapper = shallow(<Note text="text" />);
		expect(wrapper.html()).not.toBeNull();
	});
});
