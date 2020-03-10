import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

const family = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-family-home', () => {
	it('renders without crashing', () => {
		render(
			<Home
				family={family}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
