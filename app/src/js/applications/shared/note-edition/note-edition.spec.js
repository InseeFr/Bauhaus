import React from 'react';
import { render } from '@testing-library/react';
import NoteEdition from './';

const langs = { lg1: 'fr', lg2: 'en' };

describe('note-edition', () => {
	it('renders without crashing', () => {
		render(
			<NoteEdition
				langs={langs}
				handleChangeLg1={jest.fn()}
				handleChangeLg2={jest.fn()}
			/>
		);
	});
});
