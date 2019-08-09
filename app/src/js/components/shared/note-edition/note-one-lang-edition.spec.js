import React from 'react';
import { shallow } from 'enzyme';
import NoteOneLangEdition from './note-one-lang-edition';

const lang = 'fr';
const handle = () => console.log('change');

describe('note-one-lang-edition', () => {
	it('renders without crashing', () => {
		shallow(<NoteOneLangEdition lang={lang} handleChange={handle} />);
	});
});
