import React from 'react';
import { shallow } from 'enzyme';
import SendConcept from './home';

describe('concept-send', () => {
	it('renders without crashing', () => {
		shallow(
			<SendConcept
				id="id"
				prefLabelLg1="prefLabelLg1"
				properties={{}}
				isValidated="false"
				sendConcept={() => console.log('send')}
			/>
		);
	});
});
