import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-item-controls', () => {
	it('renders without crashing', () => {
		render(<Controls classificationId="nafr2" itemId="A" version={'1'} />, {
			wrapper: MemoryRouter,
		});
	});
});
