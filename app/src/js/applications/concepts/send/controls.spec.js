import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('concept-send-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				isRecipientValid={true}
				sendMessage={() => console.log('send')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
