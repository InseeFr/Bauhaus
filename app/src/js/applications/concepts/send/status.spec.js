import React from 'react';
import { render } from '@testing-library/react';
import Status from './status';
import { MemoryRouter } from 'react-router-dom';

describe('concept-send-status', () => {
	it('renders without crashing', () => {
		render(<Status status="OK" urlBack="/concepts" />, {
			wrapper: MemoryRouter,
		});
	});
});
