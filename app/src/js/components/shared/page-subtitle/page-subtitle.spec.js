import React from 'react';
import { shallow } from 'enzyme';
import PageSubtitle from './';

describe('page-subTitle', () => {
	it('renders without crashing', () => {
		shallow(<PageSubtitle subTitle="subTitle" />);
	});

	it('returns component subtitle', () => {
		const wrapper = shallow(<PageSubtitle subTitle="subTitle" />);
		expect(wrapper.find('.page-subtitle-concepts').text()).toEqual('subTitle');
	});

	it('returns component into row', () => {
		const wrapper = shallow(<PageSubtitle subTitle="subTitle" />);
		expect(wrapper.find('.row')).toHaveLength(1);
	});

	it('returns component with context', () => {
		const wrapper = shallow(
			<PageSubtitle subTitle="subTitle" context="classifications" />
		);
		expect(wrapper.find('.page-subtitle')).toHaveLength(0);
		expect(wrapper.find('.page-subtitle-classifications')).toHaveLength(1);
	});
});
