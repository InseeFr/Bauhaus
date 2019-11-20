import React from 'react';
import { shallow } from 'enzyme';
import NoteVisualization from './';

const langs = { lg1: 'fr', lg2: 'en' };

describe('note-visualization', () => {
	it('renders without crashing', () => {
		shallow(<NoteVisualization params={[]} langs={langs} secondLang={false} />);
	});
});
