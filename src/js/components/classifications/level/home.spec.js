import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const level = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	members: [{ id: '1', label: 'Member 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-level-home', () => {
	it('renders without crashing', () => {
		shallow(<Home level={level} langs={langs} />);
	});
});
