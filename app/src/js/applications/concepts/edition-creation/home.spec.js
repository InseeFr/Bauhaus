import React from 'react';
import { render } from '@testing-library/react';
import ConceptEditionCreation from './home';
import { empty } from 'js/utils/concepts/general';
import { MemoryRouter } from 'react-router-dom';

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
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
			</MemoryRouter>
		);
	});
});
