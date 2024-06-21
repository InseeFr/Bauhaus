import { render } from '@testing-library/react';
import NoteOneLangEdition from './note-one-lang-edition';

const lang = 'fr';

describe('note-one-lang-edition', () => {
	it('renders without crashing', () => {
		render(<NoteOneLangEdition lang={lang} handleChange={jest.fn()} />);
	});
});
