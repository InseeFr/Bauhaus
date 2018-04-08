import React from 'react';
import { shallow } from 'enzyme';
import General from './general';

const general = {};
const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-series-general', () => {
	it('renders without crashing', () => {
		shallow(<General general={general} secondLang={false} langs={langs} />);
	});
});
