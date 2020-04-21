import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';
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
		render(<Home series={series} langs={langs} secondLang={true} />, {
			wrapper: MemoryRouter,
		});
	});
});
