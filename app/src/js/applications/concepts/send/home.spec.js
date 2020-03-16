import React from 'react';
import { render } from '@testing-library/react';
import SendConcept from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concept-send', () => {
	it('renders without crashing', () => {
		render(
			<SendConcept
				id="id"
				prefLabelLg1="prefLabelLg1"
				properties={{}}
				isValidated="false"
				sendConcept={() => console.log('send')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
