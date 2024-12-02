import { render } from '@testing-library/react';

import Notes from './notes';

const notes = {};

describe('classification-series-notes', () => {
	it('renders without crashing', () => {
		render(<Notes notes={notes} secondLang={false} />);
	});
});
