import React from 'react';
import { shallow } from 'enzyme';
import Compare from './home';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		shallow(
			<Compare
				id={'id'}
				conceptGeneral={{ conceptVersion: '2' }}
				notes={{}}
				secondLang={false}
				saveSecondLang={() => console.log('save second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
