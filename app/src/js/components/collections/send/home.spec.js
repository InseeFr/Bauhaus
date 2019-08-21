import React from 'react';
import { shallow } from 'enzyme';
import SendCollection from './home';

describe('collection-send', () => {
	it('renders without crashing', () => {
		shallow(
			<SendCollection
				id="id"
				prefLabelLg1="prefLabelLg1"
				properties={{}}
				isValidated="false"
				sendCollection={() => console.log('send')}
			/>
		);
	});
});
