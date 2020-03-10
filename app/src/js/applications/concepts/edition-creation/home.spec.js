import React from 'react';
import { render } from '@testing-library/react';
import ConceptEditionCreation from './home';
import { empty } from 'js/utils/concepts/general';

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		render(
			<ConceptEditionCreation
				id="id"
				creation={true}
				title="title"
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				stampList={[]}
				disseminationStatusList={[]}
				save={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
