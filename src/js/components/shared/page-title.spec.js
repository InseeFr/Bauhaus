import React from 'react';
import { shallow } from 'enzyme';
import PageTitle from './page-title';

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
});
