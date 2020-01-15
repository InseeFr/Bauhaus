import React from 'react';
import { shallow } from 'enzyme';
import { MenuOperations } from '.';

describe('menu-operations', () => {
	it('renders without crashing', () => {
		shallow(
			<MenuOperations location={{ pathname: '/location' }} permission={{}} />
		);
	});
});
