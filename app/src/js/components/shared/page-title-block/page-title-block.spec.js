import React from 'react';
import { shallow } from 'enzyme';
import PageTitleBlock from './';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';

describe('page-title-bloc', () => {
	it('renders one PageTitle only is secondLang is false', () => {
		const wrapper = shallow(<PageTitleBlock titleLg1="titleLg1" />);
		expect(wrapper.find(PageTitle)).toHaveLength(1);
		expect(wrapper.find(PageSubtitle)).toHaveLength(0);
	});

	it('renders one PageTitle only is titleLg2 is undefined', () => {
		const wrapper = shallow(
			<PageTitleBlock titleLg1="titleLg1" secondLang={true} />
		);
		expect(wrapper.find(PageTitle)).toHaveLength(1);
		expect(wrapper.find(PageSubtitle)).toHaveLength(0);
	});

	it('renders one PageTitle and one PageSubstitle', () => {
		const wrapper = shallow(
			<PageTitleBlock
				titleLg1="titleLg1"
				titleLg2="titleLg2"
				secondLang={true}
			/>
		);
		expect(wrapper.find(PageTitle)).toHaveLength(1);
		expect(wrapper.find(PageSubtitle)).toHaveLength(1);
	});
});
