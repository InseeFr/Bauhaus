import React from 'react';
import { shallow } from 'enzyme';
import PageSubtitle from '.';

describe('page-subTitle', () => {
	it('renders without crashing', () => {
		shallow(<PageSubtitle subTitle="subTitle" />);
	});

	it('returns component subtitle', () => {
		const wrapper = shallow(<PageSubtitle subTitle="subTitle" />);
		expect(wrapper.find('.bauhaus-page-subtitle').text()).toEqual('subTitle');
	});

	it('returns component into row', () => {
		const wrapper = shallow(<PageSubtitle subTitle="subTitle" />);
		expect(wrapper.find('.row')).toHaveLength(1);
	});
});
