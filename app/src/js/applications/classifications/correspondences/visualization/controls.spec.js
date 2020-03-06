import React from 'react';
import { render } from '@testing-library/react';
import CorrespondenceControls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-correspondence-visualization-controls', () => {
	it('renders without crashing', () => {
		render(<CorrespondenceControls />, {
			wrapper: MemoryRouter,
		});
	});
});
