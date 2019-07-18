import React from 'react';
import Controls from './controls';
import { shallow } from 'enzyme';

describe('concepts-advanced-search-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<Controls
				onClickReturn={() => console.log('return')}
				initializeState={() => console.log('init state')}
			/>
		);
	});
});
