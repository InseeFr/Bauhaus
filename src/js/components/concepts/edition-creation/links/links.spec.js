import React from 'react';
import { shallow } from 'enzyme';
import ConceptLinks from './';

describe('concept-edition-creation-links', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptLinks
				conceptsWithLinks={[]}
				handleChange={() => console.log('save')}
			/>
		);
	});
});
