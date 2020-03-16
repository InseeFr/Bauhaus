import React from 'react';
import { render } from '@testing-library/react';
import ConceptVisualizationStandBy from './stand-by';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		render(
			<ConceptVisualizationStandBy
				general={{
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
					conceptVersion: 'conceptVersion',
				}}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
