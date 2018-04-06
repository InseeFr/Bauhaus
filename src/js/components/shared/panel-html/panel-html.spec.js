import React from 'react';
import { shallow } from 'enzyme';
import PanelHtml from './panel-html';

describe('panel-html', () => {
	it('renders without crashing', () => {
		shallow(<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>);
	});

	it('returns component title', () => {
		const wrapper = shallow(
			<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>
		);
		expect(wrapper.find('.panel-title').text()).toEqual('title');
	});

	it('returns panel body', () => {
		const wrapper = shallow(
			<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>
		);
		expect(wrapper.find('.panel-body').exists()).toBeTruthy();
	});
});
