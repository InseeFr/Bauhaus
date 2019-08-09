import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const item = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	notes: {},
	narrowers: [{ id: '1', label: 'Narrower 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-item-home', () => {
	it('renders without crashing', () => {
		shallow(
			<Home
				item={item}
				langs={langs}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
			/>
		);
	});
});
