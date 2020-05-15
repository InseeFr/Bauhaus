import React from 'react';
import Controls from './controls';
import { render } from '@testing-library/react';

describe('concepts-advanced-search-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				onClickReturn={() => console.log('return')}
				initializeState={() => console.log('init state')}
			/>
		);
	});
});
