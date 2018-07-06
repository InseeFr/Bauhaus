import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';
import * as associationUtils from 'js/utils/classifications/correspondence/association';

describe('association-home', () => {
	it('renders without crashing', () => {
		shallow(
			<Home
				association={associationUtils.empty()}
				secondLang={false}
				saveSecondLang={() => console.log('save second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
