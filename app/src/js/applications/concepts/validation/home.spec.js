import React from 'react';
import { render } from '@testing-library/react';
import ConceptValidation from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concept-validation', () => {
	it('renders without crashing', () => {
		render(
			<ConceptValidation
				concepts={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateConceptList={() => console.log('validation')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
