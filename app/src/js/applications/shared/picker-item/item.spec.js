import React from 'react';
import { shallow } from 'enzyme';
import Item from './';
import addLogo from 'js/applications/shared/logo/logo-add';

describe('picker-page', () => {
	it('renders without crashing', () => {
		shallow(
			<Item
				id="id"
				label="label"
				logo={addLogo}
				handleClick={() => console.log('action')}
			/>
		);
	});
});
