import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const classification = {
	general: { prefLabelLg1: 'Label' },
	levels: [{ id: '1', label: 'Member 1' }],
	notes: {
		scopeNoteLg1: 'scopeNoteLg1',
		scopeNoteLg2: 'scopeNoteLg2',
		changeNoteLg1: 'changeNoteLg1',
		changeNoteLg2: 'changeNoteLg2',
	},
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-home', () => {
	it('renders without crashing', () => {
		shallow(<Home classification={classification} langs={langs} />);
	});
});
