import React from 'react';
import { shallow } from 'enzyme';
import PickerItem from '.';

describe('picker-page', () => {
	it('renders without crashing', () => {
		shallow(
			<PickerItem
				id="id"
				label="label"
				handleClick={() => console.log('action')}
			/>
		);
	});
});
