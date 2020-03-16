import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

const item = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	notes: {},
	narrowers: [{ id: '1', label: 'Narrower 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-item-home', () => {
	it('renders without crashing', () => {
		render(
			<Home
				item={item}
				langs={langs}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
