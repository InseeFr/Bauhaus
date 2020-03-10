import React from 'react';
import { render } from '@testing-library/react';
import Tabs from './';

const tabs = [
	{ id: 1, title: 'Tab 1', content: <p>Content 1</p> },
	{ id: 2, title: 'Tab 2', content: <p>Content 2</p> },
];

describe('tabs', () => {
	it('renders without crashing', () => {
		render(<Tabs tabs={tabs} />);
	});
});
