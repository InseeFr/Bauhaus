import React from 'react';
import { render } from '@testing-library/react';
import ExportConcept from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concept-export', () => {
	it('renders without crashing', () => {
		render(
			<ExportConcept
				concepts={[]}
				handleExportConceptList={jest.fn()}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
