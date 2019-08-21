import React from 'react';
import { shallow } from 'enzyme';
import Notes from './notes';

const notes = {};
const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-series-notes', () => {
	it('renders without crashing', () => {
		shallow(<Notes notes={notes} secondLang={false} langs={langs} />);
	});
});
