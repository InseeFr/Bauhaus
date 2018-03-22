import React from 'react';
import { shallow } from 'enzyme';
import Tabs from './tabs-rmes';

const tabs = Array.apply(null, Array(5)).map((a, i) => ({
	title: `Title ${i + 1}`,
	content: `Content ${i + 1}`,
}));

describe('tabs', () => {
	it('renders without crashing', () => {
		shallow(<Tabs tabs={tabs} />);
	});

	it('renders tabs.length tab', () => {
		const wrapper = shallow(<Tabs tabs={tabs} />);
		expect(wrapper.find('[id="informationToManage"]').children()).toHaveLength(
			tabs.length
		);
	});
});
