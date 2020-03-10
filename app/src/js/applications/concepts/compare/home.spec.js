import React from 'react';
import { render } from '@testing-library/react';
import Compare from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		render(
			<Compare
				id={'id'}
				conceptGeneral={{ conceptVersion: '2' }}
				notes={{ '2': {}, '1': {} }}
				secondLang={false}
				saveSecondLang={() => console.log('save second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
