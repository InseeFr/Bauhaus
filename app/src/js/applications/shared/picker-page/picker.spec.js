import React from 'react';
import { render } from '@testing-library/react';
import PagePicker from './';
import { MemoryRouter } from 'react-router-dom';
const items = [{ id: '1', label: 'Item 1' }];

describe('picker-page', () => {
	it('renders without crashing', () => {
		render(
			<PagePicker
				items={items}
				title="title"
				panelTitle="panelTitle"
				labelWarning="labelWarning"
				labelValidateButton="labelValidateButton"
				handleAction={() => console.log('action')}
				context="concepts"
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
