import { render } from '@testing-library/react';
import ConceptNotes from './notes';
import { locales } from '../../tests-utils/default-values';
import { emptyNotes } from '../utils/notes';

describe('concept-edition-creation-notes', () => {
	it('renders without crashing', () => {
		render(
			<ConceptNotes
				notes={emptyNotes}
				disseminationStatus=""
				handleChange={vi.fn()}
				langs={locales}
			/>,
		);
	});
});
