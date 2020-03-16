import React from 'react';
import { render } from '@testing-library/react';
import Notes from './notes';

const notes = {};
const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-notes', () => {
	it('renders without crashing', () => {
		render(<Notes notes={notes} secondLang={false} langs={langs} />);
	});
});
