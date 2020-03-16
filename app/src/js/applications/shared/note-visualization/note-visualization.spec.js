import React from 'react';
import { render } from '@testing-library/react';
import NoteVisualization from './';

const langs = { lg1: 'fr', lg2: 'en' };

describe('note-visualization', () => {
	it('renders without crashing', () => {
		render(<NoteVisualization params={[]} langs={langs} secondLang={false} />);
	});
});
