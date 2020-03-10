import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SendCollection from './home';

describe('collection-send', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<SendCollection
					id="id"
					prefLabelLg1="prefLabelLg1"
					properties={{}}
					isValidated="false"
					sendCollection={() => console.log('send')}
				/>
			</MemoryRouter>
		);
	});
});
