import React from 'react';
import { render } from '@testing-library/react';
import CollectionVisualizationControls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('collection-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<CollectionVisualizationControls
				id="id"
				isValidated={false}
				handleValidation={() => console.log('validate')}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
