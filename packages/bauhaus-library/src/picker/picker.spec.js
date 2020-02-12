import React from 'react';
import { shallow } from 'enzyme';
import PagePicker from '.';

const items = [{ id: '1', label: 'Item 1' }];

describe('picker-page', () => {
	it('renders without crashing', () => {
		shallow(
			<PagePicker
				items={items}
				title="title"
				panelTitle="panelTitle"
				labelWarning="labelWarning"
				labelValidateButton="labelValidateButton"
				handleAction={() => console.log('action')}
				context="concepts"
			/>
		);
	});
});
