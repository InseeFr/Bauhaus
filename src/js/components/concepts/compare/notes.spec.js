import React from 'react';
import { shallow } from 'enzyme';
import CompareNotes from './notes';

describe('concepts-compare-notes', () => {
	it('renders without crashing', () => {
		shallow(
			<CompareNotes
				notesVersion1={{}}
				notesVersion2={{}}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
