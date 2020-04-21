import React from 'react';
import { render } from '@testing-library/react';
import Compare from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		render(
			<Compare
				classificationId={'classificationId'}
				itemId={'itemId'}
				general={{
					prefLabelLg1: 'prefLabelLg1',
					isValidated: 'true',
					conceptVersion: '2',
				}}
				notes={{ '1': {}, '2': {} }}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
