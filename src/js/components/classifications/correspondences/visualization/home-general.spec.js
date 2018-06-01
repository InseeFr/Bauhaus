import React from 'react';
import { shallow } from 'enzyme';
import HomeGeneral from './home-general';

const correspondence = {
	id: '1',
	labelLg1: 'Correspondence 1',
	idFirstClass: 'class1',
	firstClassLabelLg1: 'Classification 1',
	idSecondClass: 'class2',
	secondClassLabelLg1: 'Classification 2',
};

describe('correspondence-home-general', () => {
	it('renders without crashing', () => {
		shallow(
			<HomeGeneral
				correspondence={correspondence}
				secondLang={true}
				saveSecondLang={() => console.log('second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
