import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Status from './status';

describe('collection-send-status', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<Status status="OK" urlBack="/collections" />
			</MemoryRouter>
		);
	});
});
