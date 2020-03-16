import React from 'react';
import { render } from '@testing-library/react';
import ConceptGeneralVisualization from './general';
import { empty } from 'js/utils/concepts/general';

describe('concept-visualization-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
