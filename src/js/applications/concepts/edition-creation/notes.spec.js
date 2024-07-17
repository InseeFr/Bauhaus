import { render } from '@testing-library/react';
import ConceptNotes from './notes';
import { emptyNotes } from '../../../utils/concepts/notes';

describe('concept-edition-creation-notes', () => {
	it('renders without crashing', () => {
		render(
			<ConceptNotes
				notes={emptyNotes}
				disseminationStatus=""
				handleChange={jest.fn()}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
