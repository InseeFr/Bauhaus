import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import * as associationUtils from 'js/applications/classifications/utils/correspondence/association';
import { MemoryRouter } from 'react-router-dom';
describe('association-home', () => {
	it('renders without crashing', () => {
		render(
			<Home
				association={associationUtils.empty()}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
