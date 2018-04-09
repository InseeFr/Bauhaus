import React from 'react';
import { shallow } from 'enzyme';
import Compare from './home';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		shallow(
			<Compare
				id={'id'}
				conceptNotes={[]}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
