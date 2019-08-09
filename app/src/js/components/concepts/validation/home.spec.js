import React from 'react';
import { shallow } from 'enzyme';
import ConceptValidation from './home';

describe('concept-validation', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptValidation
				concepts={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateConceptList={() => console.log('validation')}
			/>
		);
	});
});
