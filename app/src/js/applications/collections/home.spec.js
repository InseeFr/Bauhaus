import React from 'react';
import { shallow } from 'enzyme';
import Collections from './home';

describe('collections', () => {
	it('renders without crashing', () => {
		shallow(
			<Collections
				collections={[]}
				permission={{ authType: '', roles: [''] }}
			/>
		);
	});
});
