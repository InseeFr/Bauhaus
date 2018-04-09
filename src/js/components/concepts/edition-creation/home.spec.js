import React from 'react';
import { shallow } from 'enzyme';
import ConceptEditionCreation from './home';
import { empty } from 'js/utils/concepts/general';

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		shallow(
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
