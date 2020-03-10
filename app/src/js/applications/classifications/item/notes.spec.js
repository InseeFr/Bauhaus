import React from 'react';
import { render } from '@testing-library/react';
import ItemNotesVisualization from './notes';

describe('classification-visualization-notes', () => {
	it('renders without crashing', () => {
		render(
			<ItemNotesVisualization
				notes={{}}
				langs={{ lg1: 'fr', lg2: 'en' }}
				secondLang={true}
			/>
		);
	});
});
