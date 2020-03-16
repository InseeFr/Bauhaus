import React from 'react';
import Controls from './controls';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('collection-send-controls', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<Controls
					isRecipientValid={true}
					urlBack="collections"
					sendMessage={() => console.log('send')}
				/>
			</MemoryRouter>
		);
	});
});
