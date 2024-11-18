import { render } from '@testing-library/react';

import NoteOneLangEdition from './note-one-lang-edition';

describe('note-one-lang-edition', () => {
	it('renders without crashing', () => {
		render(
			<NoteOneLangEdition note="note" maxLength={0} handleChange={vi.fn()} />,
		);
	});
});
