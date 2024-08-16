import { render } from '@testing-library/react';
import { NoteEdition } from './';
import { locales } from '../../tests-utils/default-values';

describe('note-edition', () => {
	it('renders without crashing', () => {
		render(
			<NoteEdition
				langs={locales}
				handleChangeLg1={jest.fn()}
				handleChangeLg2={jest.fn()}
			/>
		);
	});
});
