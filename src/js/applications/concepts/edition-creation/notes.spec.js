import { render } from '@testing-library/react';
import ConceptNotes from './notes';
import { emptyNotes } from '../../../new-architecture/modules-concepts/utils/notes';
import { locales } from '../../../new-architecture/tests-utils/default-values';

describe('concept-edition-creation-notes', () => {
	it('renders without crashing', () => {
		render(
			<ConceptNotes
				notes={emptyNotes}
				disseminationStatus=""
				handleChange={jest.fn()}
				langs={locales}
			/>
		);
	});
});
