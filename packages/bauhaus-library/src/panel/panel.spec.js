import React from 'react';
import { shallow } from 'enzyme';
import Panel from './';

describe('panel', () => {
	it('renders without crashing', () => {
		shallow(<Panel title="title">body</Panel>);
	});

	it('returns component title', () => {
		const wrapper = shallow(<Panel title="title">body</Panel>);
		expect(wrapper.find('.panel-title').text()).toEqual('title');
	});

	it('returns component title (element)', () => {
		const wrapper = shallow(<Panel title={<div>title</div>}>body</Panel>);
		expect(wrapper.containsMatchingElement(<div>title</div>)).toBeTruthy();
	});

	it('returns panel body', () => {
		const wrapper = shallow(<Panel title="title">body</Panel>);
		expect(wrapper.find('.panel-body').text()).toEqual('body');
	});
});
