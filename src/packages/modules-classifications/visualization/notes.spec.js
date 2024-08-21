import { render } from '@testing-library/react';
import Notes from './notes';
import { locales } from '../../tests-utils/default-values';

const notes = {};

describe('classification-notes', () => {
	it('renders without crashing', () => {
		render(<Notes notes={notes} secondLang={false} langs={locales} />);
	});
});