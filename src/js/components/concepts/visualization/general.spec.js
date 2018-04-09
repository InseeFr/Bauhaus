import React from 'react';
import { shallow } from 'enzyme';
import ConceptGeneralVisualization from './general';
import { empty } from 'js/utils/concepts/general';

describe('concept-visualization-general', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
