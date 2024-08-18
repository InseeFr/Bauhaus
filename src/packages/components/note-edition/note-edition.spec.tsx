import { render } from '@testing-library/react';
import { NoteEdition } from './';

describe('note-edition', () => {
	it('renders without crashing', () => {
		render(
			<NoteEdition
				noteLg1="noteLg1"
				noteLg2="noteLg2"
				handleChangeLg1={jest.fn()}
				handleChangeLg2={jest.fn()}
				maxLength={0}
			/>
		);
	});
});
