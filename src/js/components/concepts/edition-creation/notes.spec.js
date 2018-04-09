import React from 'react';
import { shallow } from 'enzyme';
import ConceptNotes from './notes';
import { emptyNotes } from 'js/utils/concepts/notes';

describe('concept-edition-creation-notes', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptNotes
				notes={emptyNotes}
				disseminationStatus=""
				handleChange={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
