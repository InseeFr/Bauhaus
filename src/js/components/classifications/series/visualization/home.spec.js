import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const series = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
	notes: {
		scopeNoteLg1: 'scopeNoteLg1',
		scopeNoteLg2: 'scopeNoteLg2',
	},
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		shallow(<Home series={series} langs={langs} />);
	});
});
