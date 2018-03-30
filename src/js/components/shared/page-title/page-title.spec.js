import React from 'react';
import { shallow } from 'enzyme';
import PageTitle from './';

describe('page-title', () => {
	it('renders without crashing', () => {
		shallow(<PageTitle title="title" subtitle="subtitle" />);
	});

	it('returns component title', () => {
		const wrapper = shallow(<PageTitle title="title" />);
		expect(wrapper.find('.page-title').text()).toEqual('title');
	});

	it('returns component text', () => {
		const wrapper = shallow(<PageTitle title="title" subtitle="subtitle" />);
		expect(wrapper.find('.page-title').text()).toEqual('title" subtitle "');
	});

	it('returns component into row', () => {
		const wrapper = shallow(<PageTitle title="title" subtitle="subtitle" />);
		expect(wrapper.find('.row')).toHaveLength(1);
	});

	it('returns component with context', () => {
		const wrapper = shallow(<PageTitle title="title" context="context" />);
		expect(wrapper.find('.page-title')).toHaveLength(0);
		expect(wrapper.find('.page-title-context')).toHaveLength(1);
	});

	it('returns component with context, col and offset', () => {
		const wrapper = shallow(
			<PageTitle title="title" context="context" col={2} offset={5} />
		);
		expect(
			wrapper
				.find('div')
				.last()
				.props().className
		).toEqual('col-md-2 centered col-md-offset-5');
	});
});
