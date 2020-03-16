import React from 'react';
import { render } from '@testing-library/react';
import ConceptVisualization from './home';
import { empty } from 'js/utils/concepts/general';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		render(
			<ConceptVisualization
				id="id"
				general={empty()}
				notes={{}}
				links={[]}
				stampList={[]}
				disseminationStatusList={[]}
				validateConcept={() => console.log('validate')}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
