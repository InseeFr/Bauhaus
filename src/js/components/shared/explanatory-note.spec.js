import React from 'react';
import { shallow } from 'enzyme';
import { ExplanatoryNote } from './explanatory-note';

describe('explanatory-note', () => {
	it('renders without crashing', () => {
		shallow(<ExplanatoryNote />);
	});

	it('renders null component', () => {
		const wrapper = shallow(<ExplanatoryNote />);
		expect(wrapper.html()).toBeNull();
	});

	it('renders not null component', () => {
		const wrapper = shallow(<ExplanatoryNote text="text" />);
		expect(wrapper.html()).not.toBeNull();
	});
});
