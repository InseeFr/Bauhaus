import { render } from '@testing-library/react';
import { NoteVisualization } from './';
import { locales } from '../../tests-utils/default-values';

describe('note-visualization', () => {
	it('renders without crashing', () => {
		render(
			<NoteVisualization params={[]} langs={locales} secondLang={false} />
		);
	});
});
