import React from 'react';
import { shallow } from 'enzyme';
import NoteEdition from './';

const langs = { lg1: 'fr', lg2: 'en' };
const handle = () => console.log('change');

describe('note-edition', () => {
	it('renders without crashing', () => {
		shallow(
			<NoteEdition
				langs={langs}
				handleChangeLg1={handle}
				handleChangeLg2={handle}
			/>
		);
	});
});
