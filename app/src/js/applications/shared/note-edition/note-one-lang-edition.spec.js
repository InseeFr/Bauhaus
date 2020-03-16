import React from 'react';
import { render } from '@testing-library/react';
import NoteOneLangEdition from './note-one-lang-edition';

const lang = 'fr';
const handle = () => console.log('change');

describe('note-one-lang-edition', () => {
	it('renders without crashing', () => {
		render(<NoteOneLangEdition lang={lang} handleChange={handle} />);
	});
});
