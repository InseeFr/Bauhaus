import React from 'react';
import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from 'js/utils/concepts/general';

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneral
				general={empty()}
				stampList={[]}
				disseminationStatusList={[]}
				handleChange={jest.fn()}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
