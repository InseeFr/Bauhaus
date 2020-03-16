import React from 'react';
import { render } from '@testing-library/react';
import Tabs from './tabs-rmes';

const tabs = Array.apply(null, Array(5)).map((a, i) => ({
	title: `Title ${i + 1}`,
	content: `Content ${i + 1}`,
}));

describe('tabs', () => {
	it('renders without crashing', () => {
		render(<Tabs tabs={tabs} />);
	});

	it('renders tabs.length tab', () => {
		const { container } = render(<Tabs tabs={tabs} />);
		expect(
			container.querySelector('[id="informationToManage"] ul').children
		).toHaveLength(tabs.length);
	});
});
