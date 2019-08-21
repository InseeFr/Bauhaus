import React from 'react';
import { shallow } from 'enzyme';
import ConceptGeneral from './general';
import { empty } from 'js/utils/concepts/general';

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptGeneral
				general={empty()}
				stampList={[]}
				disseminationStatusList={[]}
				handleChange={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
